from selenium import webdriver

import selenium
from selenium.common.exceptions import NoSuchElementException


def extractMoves(movesPlayed, nextMove, castle, board):
    print(movesPlayed,nextMove,castle,board)

credentialFile = open("../../credentials.txt", "r")

urlFile = open("../../url.txt", "r")

jsFile = open("./scrape.js","r")

username = credentialFile.readline()

password = credentialFile.readline()

url = urlFile.readline()

script = jsFile.read()

credentialFile.close()

urlFile.close()

jsFile.close()

loginUrl = "https://chess.com/login"

print(username, password)


browser = webdriver.Firefox()

browser.get(loginUrl)

usernameInput = browser.find_element_by_xpath('//*[@id="username"]')

passwordInput = browser.find_element_by_xpath('//*[@id="password"]')

submitButton = browser.find_element_by_xpath('//*[@id="login"]')

usernameInput.send_keys(username)

passwordInput.send_keys(password)

submitButton.click()

browser.get(url)

browser.execute_script(script,extractMoves)

browser.close()