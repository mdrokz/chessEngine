# This is just an example to get you started. A typical binary package
# uses this file as the main entry point of the application.
import strutils

import nre

var list = ["piece wr square-11",
     "piece wk square-71",
     "piece wr square-62",
     "piece wp square-13",
     "piece wp square-33",
     "piece bq square-53",
     "piece wn square-63",
     "piece bn square-73",
     "piece bp square-83",
     "piece wp square-24",
     "piece wb square-54",
     "piece bk square-85",
     "piece bp square-26",
     "piece bp square-46",
     "piece wq square-76",
     "piece bp square-17",
     "piece bp square-37"
 ];

type ChessBoard = seq[seq[string]]

var chessBoard: ChessBoard = newSeq[seq[string]](9);

for i,_ in chessBoard: 
  chessBoard[i] = newSeq[string](9);

proc getPieceInitials(piece: string): string =
  if piece.len() > 0:
    case piece:
    of "wp":
      return "P"
    of "wr":
      return "R"
    of "wq":
      return "Q"
    of "wn":
      return "N"
    of "wk":
      return "K"
    of "wb":
      return "B"
    # Black
    of "bp":
      return "p"
    of "br":
      return "r"
    of "bq":
      return "q"
    of "bn":
      return "n"
    of "bk":
      return "k"
    of "bb":
      return "b"
  else:
    return "1"


proc replaceAt(str: string,index: int,replacement: int): string =
    if index >= str.len():
      return str
    echo index
    return str.substr(0, index) & $replacement & str.substr(index + 1)

proc getFenString(list: array[0..16,string]): void {.stdcall,exportc,dynlib.} =
  for f in list:
    var className:string = $f
    var captured: seq[int] = newSeq[int](2)
    var piece: string;

    var matched = className.findAll(re"square-\d\d")
    if matched.len() > 0:
      var sqMatch = matched[0].findAll(re"\d")
      if sqMatch.len() > 0:
         captured[0] = parseInt(sqMatch[0])
         captured[1] = parseInt(sqMatch[1])

    var p = className.findAll(re"\s..\s")
    if p.len() > 0:
      piece = p[0].strip()
    chessBoard[captured[1]][captured[0]] = piece
  var strFen: string = "";

  for i in countdown(8,1):
    for j in 1..8:
      var p = getPieceInitials(chessBoard[i][j])
      if p.len() > 0:
        strFen &= p
    if i > 1:
     strFen &= "/" 
    
  var x = strFen.split("/")
  var y = newSeq[string]()
  echo x
  for v in x:
    var newFen = ""
    var occ = 0

    for i in 0..<8:
      echo v
      if v[i] == '1':
        occ += 1

        if occ > 1:
          var pos = newFen.len() - 1;
          newFen = replaceAt(newFen, pos, occ);
          # echo newFen
        else:
          newFen &= v[i]
      else:
        occ = 0
        newFen &= v[i]

    y.add(newFen)

  var fen = y.join("/")
  # echo fen



getFenString(list)