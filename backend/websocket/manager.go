package websocket

import (
	"encoding/json"
	"log"
	"strconv"
	"sync"
	"time"

	"github.com/gofiber/websocket/v2"
	"toDone/models"
)

// Client represents a connected WebSocket client
type Client struct {
	ID       string
	UserID   string
	BoardID  string
	Conn     *websocket.Conn
	Send     chan []byte
	Manager  *Manager
}

// Manager manages all WebSocket connections
type Manager struct {
	Clients    map[string]*Client
	Broadcast  chan models.WebSocketMessage
	Register   chan *Client
	Unregister chan *Client
	mutex      sync.RWMutex
}

// NewManager creates a new WebSocket manager
func NewManager() *Manager {
	return &Manager{
		Clients:    make(map[string]*Client),
		Broadcast:  make(chan models.WebSocketMessage),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
	}
}

// Start starts the WebSocket manager
func (m *Manager) Start() {
	for {
		select {
		case client := <-m.Register:
			m.mutex.Lock()
			m.Clients[client.ID] = client
			m.mutex.Unlock()
			log.Printf("Client registered: %s (User: %s, Board: %s)", client.ID, client.UserID, client.BoardID)

		case client := <-m.Unregister:
			m.mutex.Lock()
			if _, ok := m.Clients[client.ID]; ok {
				delete(m.Clients, client.ID)
				close(client.Send)
			}
			m.mutex.Unlock()
			log.Printf("Client unregistered: %s", client.ID)

		case message := <-m.Broadcast:
			m.broadcastMessage(message)
		}
	}
}

// broadcastMessage sends a message to all clients in the same board
func (m *Manager) broadcastMessage(message models.WebSocketMessage) {
	data, err := json.Marshal(message)
	if err != nil {
		log.Printf("Error marshaling message: %v", err)
		return
	}

	m.mutex.RLock()
	defer m.mutex.RUnlock()

	for _, client := range m.Clients {
		// Only send to clients in the same board
		if client.BoardID == message.BoardID {
			select {
			case client.Send <- data:
			default:
				close(client.Send)
				delete(m.Clients, client.ID)
			}
		}
	}
}

// HandleWebSocket handles individual WebSocket connections
func (m *Manager) HandleWebSocket() websocket.Handler {
	return websocket.Handler(func(conn *websocket.Conn) {
		// Extract user ID and board ID from query parameters
		userID := conn.Query("user_id")
		boardID := conn.Query("board_id")

		if userID == "" || boardID == "" {
			log.Println("WebSocket connection missing user_id or board_id")
			conn.Close()
			return
		}

		client := &Client{
			ID:      generateClientID(),
			UserID:  userID,
			BoardID: boardID,
			Conn:    conn,
			Send:    make(chan []byte, 256),
			Manager: m,
		}

		// Register the client
		m.Register <- client

		// Start goroutines for reading and writing
		go client.readPump()
		go client.writePump()
	})
}

// readPump reads messages from the WebSocket connection
func (c *Client) readPump() {
	defer func() {
		c.Manager.Unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadLimit(512) // Max message size
	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket read error: %v", err)
			}
			break
		}

		// Handle incoming message
		c.handleMessage(message)
	}
}

// writePump writes messages to the WebSocket connection
func (c *Client) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued messages to the current websocket message
			n := len(c.Send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// handleMessage processes incoming WebSocket messages
func (c *Client) handleMessage(message []byte) {
	var wsMessage models.WebSocketMessage
	if err := json.Unmarshal(message, &wsMessage); err != nil {
		log.Printf("Error unmarshaling message: %v", err)
		return
	}

	// Set the board ID and user ID from the client
	wsMessage.BoardID = c.BoardID
	wsMessage.UserID = c.UserID

	// Broadcast the message to other clients in the same board
	c.Manager.Broadcast <- wsMessage
}

// generateClientID generates a unique client ID
func generateClientID() string {
	// In production, use a proper UUID generator
	return "client_" + strconv.FormatInt(time.Now().UnixNano(), 10)
}

// SendMessageToBoard sends a message to all clients in a specific board
func (m *Manager) SendMessageToBoard(boardID string, messageType string, data interface{}, userID string) {
	message := models.WebSocketMessage{
		Type:    messageType,
		Data:    data,
		BoardID: boardID,
		UserID:  userID,
	}

	m.Broadcast <- message
} 