package main

import (
	"context"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

// Функция-обертка для маршрутизатора HTTP, добавляющая параметры маршрута в контекст запроса
func (app *application) wrap(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		ctx := context.WithValue(r.Context(), "params", ps)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// Функция для настройки маршрутов HTTP
func (app *application) routes() http.Handler {
	router := httprouter.New()

	secure := alice.New(app.checkToken) // Middleware для проверки токена авторизации

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)

	router.HandlerFunc(http.MethodPost, "/v1/graphql", app.moviesGraphQL) // Обработчик для GraphQL-запросов

	router.HandlerFunc(http.MethodPost, "/v1/signin", app.Signin) // Обработчик для входа в систему

	router.HandlerFunc(http.MethodGet, "/v1/movie/:id", app.getOneMovie)                // Обработчик для получения одного фильма
	router.HandlerFunc(http.MethodGet, "/v1/movies", app.getAllMovies)                  // Обработчик для получения всех фильмов
	router.HandlerFunc(http.MethodGet, "/v1/movies/:genre_id", app.getAllMoviesByGenre) // Обработчик для получения всех фильмов по жанру

	router.HandlerFunc(http.MethodGet, "/v1/genres", app.getAllGenres) // Обработчик для получения всех жанров

	router.POST("/v1/admin/editmovie", app.wrap(secure.ThenFunc(app.editMovie)))        // Обработчик для редактирования фильма с проверкой токена авторизации
	router.GET("/v1/admin/deletemovie/:id", app.wrap(secure.ThenFunc(app.deleteMovie))) // Обработчик для удаления фильма с проверкой токена авторизации

	return app.enableCORS(router) // Применение CORS-заголовков к маршрутам
}
