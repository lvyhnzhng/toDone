package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"toDone/config"
)

// MongoDB holds the database connection and collections
type MongoDB struct {
	Client     *mongo.Client
	Database   *mongo.Database
	Users      *mongo.Collection
	Projects   *mongo.Collection
	Boards     *mongo.Collection
	Lists      *mongo.Collection
	Cards      *mongo.Collection
}

// Connect establishes connection to MongoDB
func Connect(cfg *config.Config) (*MongoDB, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Set client options
	clientOptions := options.Client().ApplyURI(cfg.Database.URI)

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, err
	}

	// Ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}

	log.Println("Connected to MongoDB!")

	// Get database and collections
	database := client.Database(cfg.Database.Name)
	
	mongodb := &MongoDB{
		Client:   client,
		Database: database,
		Users:    database.Collection("users"),
		Projects: database.Collection("projects"),
		Boards:   database.Collection("boards"),
		Lists:    database.Collection("lists"),
		Cards:    database.Collection("cards"),
	}

	// Create indexes
	if err := mongodb.createIndexes(ctx); err != nil {
		log.Printf("Warning: Failed to create indexes: %v", err)
	}

	return mongodb, nil
}

// Disconnect closes the MongoDB connection
func (m *MongoDB) Disconnect(ctx context.Context) error {
	return m.Client.Disconnect(ctx)
}

// createIndexes creates database indexes for better performance
func (m *MongoDB) createIndexes(ctx context.Context) error {
	// Users collection indexes
	_, err := m.Users.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]interface{}{
			"email": 1,
		},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		return err
	}

	_, err = m.Users.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]interface{}{
			"username": 1,
		},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		return err
	}

	// Projects collection indexes
	_, err = m.Projects.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]interface{}{
			"owner_id": 1,
		},
	})
	if err != nil {
		return err
	}

	// Boards collection indexes
	_, err = m.Boards.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]interface{}{
			"project_id": 1,
		},
	})
	if err != nil {
		return err
	}

	// Lists collection indexes
	_, err = m.Lists.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]interface{}{
			"board_id": 1,
			"position": 1,
		},
	})
	if err != nil {
		return err
	}

	// Cards collection indexes
	_, err = m.Cards.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]interface{}{
			"list_id":  1,
			"position": 1,
		},
	})
	if err != nil {
		return err
	}

	_, err = m.Cards.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]interface{}{
			"assignee_id": 1,
		},
	})
	if err != nil {
		return err
	}

	log.Println("Database indexes created successfully")
	return nil
} 