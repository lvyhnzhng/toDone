package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	CORS     CORSConfig
	WebSocket WebSocketConfig
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Port string
	Env  string
}

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	URI  string
	Name string
}

// JWTConfig holds JWT configuration
type JWTConfig struct {
	Secret     string
	ExpiresIn  string
}

// CORSConfig holds CORS configuration
type CORSConfig struct {
	AllowedOrigins []string
}

// WebSocketConfig holds WebSocket configuration
type WebSocketConfig struct {
	Path string
}

// Load loads configuration from environment variables
func Load() *Config {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	config := &Config{
		Server: ServerConfig{
			Port: getEnv("PORT", "8080"),
			Env:  getEnv("ENV", "development"),
		},
		Database: DatabaseConfig{
			URI:  getEnv("MONGODB_URI", "mongodb://localhost:27017"),
			Name: getEnv("MONGODB_DB", "todone"),
		},
		JWT: JWTConfig{
			Secret:    getEnv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production"),
			ExpiresIn: getEnv("JWT_EXPIRES_IN", "24h"),
		},
		CORS: CORSConfig{
			AllowedOrigins: getEnvSlice("ALLOWED_ORIGINS", []string{"http://localhost:3000", "http://localhost:3001"}),
		},
		WebSocket: WebSocketConfig{
			Path: getEnv("WS_PATH", "/ws"),
		},
	}

	return config
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvSlice gets an environment variable as a slice or returns a default value
func getEnvSlice(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		// Simple comma-separated values parsing
		// In production, you might want more sophisticated parsing
		return []string{value}
	}
	return defaultValue
}

// getEnvInt gets an environment variable as an integer or returns a default value
func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
} 