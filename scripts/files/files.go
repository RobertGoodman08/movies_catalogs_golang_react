package main

import (
	"fmt"
	"io/ioutil"
	"path/filepath"
)

func main() {
	files, err := filepath.Glob("cmd/api/*.go")
	if err != nil {
		fmt.Println("Ошибка при поиске файлов:", err)
		return
	}

	for _, file := range files {
		fmt.Println("Найден файл:", file)

		content, err := ioutil.ReadFile(file)
		if err != nil {
			fmt.Println("Ошибка при чтении файла:", err)
			continue
		}

		fmt.Println("Содержимое файла:")
		fmt.Println(string(content))
	}
}
