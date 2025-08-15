package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User represents a user in the system
type User struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Email     string            `json:"email" bson:"email"`
	Username  string            `json:"username" bson:"username"`
	Password  string            `json:"-" bson:"password"`
	Avatar    string            `json:"avatar" bson:"avatar,omitempty"`
	CreatedAt time.Time         `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time         `json:"updated_at" bson:"updated_at"`
}

// Project represents a project containing multiple boards
type Project struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name        string            `json:"name" bson:"name"`
	Description string            `json:"description" bson:"description"`
	OwnerID     primitive.ObjectID `json:"owner_id" bson:"owner_id"`
	Members     []Member          `json:"members" bson:"members"`
	CreatedAt   time.Time         `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at" bson:"updated_at"`
}

// Member represents a project member with role
type Member struct {
	UserID primitive.ObjectID `json:"user_id" bson:"user_id"`
	Role   string            `json:"role" bson:"role"` // owner, admin, member
	JoinedAt time.Time       `json:"joined_at" bson:"joined_at"`
}

// Board represents a kanban board
type Board struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ProjectID   primitive.ObjectID `json:"project_id" bson:"project_id"`
	Name        string            `json:"name" bson:"name"`
	Description string            `json:"description" bson:"description"`
	Lists       []List            `json:"lists" bson:"lists"`
	CreatedAt   time.Time         `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at" bson:"updated_at"`
}

// List represents a column in the kanban board
type List struct {
	ID       primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	BoardID  primitive.ObjectID `json:"board_id" bson:"board_id"`
	Name     string            `json:"name" bson:"name"`
	Position int               `json:"position" bson:"position"`
	Cards    []Card            `json:"cards" bson:"cards"`
	CreatedAt time.Time        `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time        `json:"updated_at" bson:"updated_at"`
}

// Card represents a task card
type Card struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ListID      primitive.ObjectID `json:"list_id" bson:"list_id"`
	Title       string            `json:"title" bson:"title"`
	Description string            `json:"description" bson:"description"`
	Position    int               `json:"position" bson:"position"`
	AssigneeID  *primitive.ObjectID `json:"assignee_id" bson:"assignee_id,omitempty"`
	DueDate     *time.Time        `json:"due_date" bson:"due_date,omitempty"`
	Labels      []Label           `json:"labels" bson:"labels"`
	Comments    []Comment         `json:"comments" bson:"comments"`
	CreatedBy   primitive.ObjectID `json:"created_by" bson:"created_by"`
	CreatedAt   time.Time         `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at" bson:"updated_at"`
}

// Label represents a card label
type Label struct {
	ID    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name  string            `json:"name" bson:"name"`
	Color string            `json:"color" bson:"color"`
}

// Comment represents a comment on a card
type Comment struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Content   string            `json:"content" bson:"content"`
	UserID    primitive.ObjectID `json:"user_id" bson:"user_id"`
	CreatedAt time.Time         `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time         `json:"updated_at" bson:"updated_at"`
}

// WebSocket message types
const (
	MessageTypeCardCreated   = "card_created"
	MessageTypeCardUpdated   = "card_updated"
	MessageTypeCardDeleted   = "card_deleted"
	MessageTypeCardMoved     = "card_moved"
	MessageTypeListCreated   = "list_created"
	MessageTypeListUpdated   = "list_updated"
	MessageTypeListDeleted   = "list_deleted"
	MessageTypeListMoved     = "list_moved"
	MessageTypeUserJoined    = "user_joined"
	MessageTypeUserLeft      = "user_left"
)

// WebSocketMessage represents a message sent through WebSocket
type WebSocketMessage struct {
	Type    string      `json:"type"`
	Data    interface{} `json:"data"`
	BoardID string      `json:"board_id"`
	UserID  string      `json:"user_id"`
}

// API Response structures
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// LoginRequest represents login request
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

// RegisterRequest represents registration request
type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=6"`
}

// CreateProjectRequest represents project creation request
type CreateProjectRequest struct {
	Name        string `json:"name" validate:"required,min=1"`
	Description string `json:"description"`
}

// CreateBoardRequest represents board creation request
type CreateBoardRequest struct {
	ProjectID   string `json:"project_id" validate:"required"`
	Name        string `json:"name" validate:"required,min=1"`
	Description string `json:"description"`
}

// CreateListRequest represents list creation request
type CreateListRequest struct {
	BoardID  string `json:"board_id" validate:"required"`
	Name     string `json:"name" validate:"required,min=1"`
	Position int    `json:"position"`
}

// CreateCardRequest represents card creation request
type CreateCardRequest struct {
	ListID      string     `json:"list_id" validate:"required"`
	Title       string     `json:"title" validate:"required,min=1"`
	Description string     `json:"description"`
	Position    int        `json:"position"`
	AssigneeID  *string    `json:"assignee_id"`
	DueDate     *time.Time `json:"due_date"`
	Labels      []Label    `json:"labels"`
} 