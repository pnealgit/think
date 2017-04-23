package main

import (
        "github.com/gorilla/websocket"
	"fmt"
	"log"
	"net/http"
        "strconv"
        "strings"
)

func do_something(m string) string {
    fmt.Println("in do_something m is ",m)

   rm := strings.Split(m,";")
   fmt.Println("rm[0] ",rm[0])
   fmt.Println("rm[1] ",rm[1])

   response := "0.0"
   if rm[0] == "think" {
        angle := 3.1234567 
        response = FloatToString(angle)
        fmt.Println("response,angle ",response,angle) 
  } //end of if on think
  return response
} //end of func do_somethinig


func FloatToString(input_num float64) string {
    // to convert a float number to a string
    return strconv.FormatFloat(input_num, 'f', 2, 64)
}

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
}

func echoHandler(w http.ResponseWriter, r *http.Request) {
    conn, err := websocket.Upgrade(w, r, nil,1024,1024)
    defer conn.Close()

    if err != nil {
        fmt.Println("bad echohandler connection ")
        fmt.Println(err)
        return
    }
    knt := 0 
    for {
        msgType, msg, err := conn.ReadMessage()
        m := string(msg)
        knt++
        fmt.Println("msg,knt",m,knt)

        if err != nil {
            fmt.Println("error in readmessage msg,msgtype:",msg,msgType)
            fmt.Println(err)
            return
        } //end of if on err

         response := ""
         response = do_something(m)
         fmt.Println("ON SERVER RESPONSE IS: ", response)
         err = conn.WriteMessage(msgType, []byte(response))
         if err != nil {
              fmt.Println("error in writing message...grrrr")
              fmt.Println(err)
         } //end of if on err

    } //end of for loop
} //end of function
 
func main() {

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, r.URL.Path[1:])
	})

	http.HandleFunc("nn.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, r.URL.Path[1:])
	})

	http.HandleFunc("ga.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, r.URL.Path[1:])
	})
	http.HandleFunc("food.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, r.URL.Path[1:])
	})
	http.HandleFunc("rover.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, r.URL.Path[1:])
	})

	http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hi")
	})


        http.HandleFunc("/echo", echoHandler)


        fmt.Println("listening on 8081")
	log.Fatal(http.ListenAndServe(":8081", nil))

}

