package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
	"venv/models"

	_ "github.com/lib/pq"
)

const version = "1.20" // Константа, содержащая версию

type config struct {
	port int    // Порт, на котором будет запущен сервер
	env  string // Окружение приложения (development|production)
	db   struct {
		dsn string // Строка подключения к PostgreSQL
	}
	jwt struct {
		secret string // Секрет для JWT (JSON Web Tokens)
	}
}

// Структура для представления статуса приложения
type AppStatus struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

// Структура приложения
type application struct {
	config config        // Конфигурация приложения
	logger *log.Logger   // Логгер
	models models.Models // Модели приложения
}

func main() {
	var cfg config

	// Определение флагов командной строки
	flag.IntVar(&cfg.port, "port", 4000, "Server port to listen on")
	flag.StringVar(&cfg.env, "env", "development", "Application environment (development|production")
	flag.StringVar(&cfg.db.dsn, "dsn", "postgres://postgres:93381022@localhost:5432/go_movies?sslmode=disable", "Postgres connection string")
	flag.Parse()

	// считывание jwt-секрета из env
	cfg.jwt.secret = os.Getenv("GO_MOVIES_JWT")

	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	db, err := openDB(cfg)
	if err != nil {
		logger.Fatal(err)
	}
	defer db.Close()

	app := &application{
		config: cfg,
		logger: logger,
		models: models.NewModels(db),
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	logger.Println("Starting server on port", cfg.port)

	err = srv.ListenAndServe()
	if err != nil {
		log.Println(err)
	}
}

// Функция для открытия соединения с базой данных
func openDB(cfg config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.db.dsn)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx) // Проверка соединения с базой данных
	if err != nil {
		return nil, err
	}

	return db, nil
}
