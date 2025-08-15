package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"toDone/config"
	"toDone/database"
	"toDone/websocket"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to MongoDB
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer func() {
		if err := db.Disconnect(context.Background()); err != nil {
			log.Printf("Error disconnecting from database: %v", err)
		}
	}()

	// Create WebSocket manager
	wsManager := websocket.NewManager()
	go wsManager.Start()

	// Create Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		},
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORS.AllowedOrigins,
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true,
	}))

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "toDone API is running",
			"version": "1.0.0",
		})
	})

	// WebSocket endpoint
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws", wsManager.HandleWebSocket())

	// API routes
	api := app.Group("/api/v1")
	
	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/register", handleRegister(db))
	auth.Post("/login", handleLogin(db, cfg))

	// Protected routes
	protected := api.Group("/", authMiddleware(db, cfg))
	
	// Project routes
	projects := protected.Group("/projects")
	projects.Get("/", handleGetProjects(db))
	projects.Post("/", handleCreateProject(db))
	projects.Get("/:id", handleGetProject(db))
	projects.Put("/:id", handleUpdateProject(db))
	projects.Delete("/:id", handleDeleteProject(db))

	// Board routes
	boards := protected.Group("/boards")
	boards.Get("/", handleGetBoards(db))
	boards.Post("/", handleCreateBoard(db))
	boards.Get("/:id", handleGetBoard(db))
	boards.Put("/:id", handleUpdateBoard(db))
	boards.Delete("/:id", handleDeleteBoard(db))

	// List routes
	lists := protected.Group("/lists")
	lists.Post("/", handleCreateList(db, wsManager))
	lists.Put("/:id", handleUpdateList(db, wsManager))
	lists.Delete("/:id", handleDeleteList(db, wsManager))
	lists.Post("/:id/reorder", handleReorderList(db, wsManager))

	// Card routes
	cards := protected.Group("/cards")
	cards.Post("/", handleCreateCard(db, wsManager))
	cards.Put("/:id", handleUpdateCard(db, wsManager))
	cards.Delete("/:id", handleDeleteCard(db, wsManager))
	cards.Post("/:id/move", handleMoveCard(db, wsManager))
	cards.Post("/:id/reorder", handleReorderCard(db, wsManager))

	// Start server
	go func() {
		if err := app.Listen(":" + cfg.Server.Port); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	log.Printf("Server started on port %s", cfg.Server.Port)

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}

// Placeholder handlers - these will be implemented in separate files
func handleRegister(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Register endpoint - to be implemented",
		})
	}
}

func handleLogin(db *database.MongoDB, cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Login endpoint - to be implemented",
		})
	}
}

func handleGetProjects(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Get projects endpoint - to be implemented",
		})
	}
}

func handleCreateProject(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Create project endpoint - to be implemented",
		})
	}
}

func handleGetProject(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Get project endpoint - to be implemented",
		})
	}
}

func handleUpdateProject(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Update project endpoint - to be implemented",
		})
	}
}

func handleDeleteProject(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Delete project endpoint - to be implemented",
		})
	}
}

func handleGetBoards(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Get boards endpoint - to be implemented",
		})
	}
}

func handleCreateBoard(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Create board endpoint - to be implemented",
		})
	}
}

func handleGetBoard(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Get board endpoint - to be implemented",
		})
	}
}

func handleUpdateBoard(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Update board endpoint - to be implemented",
		})
	}
}

func handleDeleteBoard(db *database.MongoDB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Delete board endpoint - to be implemented",
		})
	}
}

func handleCreateList(db *database.MongoDB, wsManager *websocket.Manager) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Create list endpoint - to be implemented",
		})
	}
}

func handleUpdateList(db *database.MongoDB, wsManager *websocket.Manager) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Update list endpoint - to be implemented",
		})
	}
}

func handleDeleteList(db *database.MongoDB, wsManager *websocket.Manager) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Delete list endpoint - to be implemented",
		})
	}
}

func handleReorderList(db *database.MongoDB, wsManager *websocket.Manager) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Reorder list endpoint - to be implemented",
		})
	}
}

func handleCreateCard(db *database.MongoDB, wsManager *websocket.Manager) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Create card endpoint - to be implemented",
		})
	}
}

func handleUpdateCard(db *database.MongoDB, wsManager *websocket.Manager) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Update card endpoint - to be implemented",
		})
	}
}

func handleDeleteCard(db *database.MongoDB, wsManager *websocket.Manager) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Delete card endpoint - to be implemented",
		})
	}
}

func handleMoveCard(db *database.MongoDB, wsManager *websocket.Manager) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Move card endpoint - to be implemented",
		})
	}
}

func handleReorderCard(db *database.MongoDB, wsManager *websocket.Manager) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Reorder card endpoint - to be implemented",
		})
	}
}

// Placeholder auth middleware
func authMiddleware(db *database.MongoDB, cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// TODO: Implement JWT authentication
		return c.Next()
	}
} 