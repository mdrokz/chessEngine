# ENGINE

This Engine will tell you best moves when you play on https://chess.com it requires an dummy account that can spectate your match on chess.com


# url.txt

in url.txt you have to put the url of your chess game example -

https://www.chess.com/game/live/id

![url](https://github.com/mdrokz/chessEngine/blob/master/examples/url.png)

# credentials.txt

in credentials.txt you need to put your dummy account's username and password, username has to be in first line and password has to be in second line example -

username <br />
password

![credentials](https://github.com/mdrokz/chessEngine/blob/master/examples/credentials.png)

# chromium window

when you run the engine binary it opens a chromium window you have to keep that in focus for the engine to get your latest moves and calculate them

![chromium](https://github.com/mdrokz/chessEngine/blob/master/examples/chromium.png)


# how it works

it logs into chess.com with the dummy account and goes to your match url and gets the moves you play in real time and feeds them to the engine which calculates the best moves.


# run from source

# javascript

you have to set const debug = true in main.js and install the dependencies and run using npm start, depending on linux or windows it will use the appropriate stockfish binary and it will start the puppeteer. remember to put url in url.txt and credentials in credentials.txt

# python 

TODO

# Nim

TODO

# building binaries

this project uses nexe for packing javascript and node binaries into exe you can go into javascript directory and run linux_build.sh for linux build or win_build.sh for windows build

# Releases

https://github.com/mdrokz/chessEngine/releases/tag/1.0.0

