Serial player
```
curl -X GET 'http://localhost:8080/serial/player?id=78&translator_id=82&episode=12&season=1'
```

Serial episodes for translation
```
curl -X GET 'http://localhost:8080/serial/episodes?id=78&translator_id=82'
```

Serial info
```
curl -X GET 'http://localhost:8080/serial?id=78'
```

Film or serial info
```
curl -X GET 'http://localhost:8080/details?id=78'
```

Film player
```
curl -X GET 'http://localhost:8080/film/player?id=4322&translator_id=252'
```

Search
```
curl -X GET 'http://localhost:8080/search?q=hello'
```

Get id from url
```
curl -X GET 'http://localhost:8080/id-from-url?url=https://rezka.ag/films/drama/34749-chuzhie-2019.html'
```