import json
import os
import os.path
from os import path
import json
import uuid
import shutil
import urllib.request
from app import app
from flask import Flask, request, redirect, jsonify, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

def load_files():
    with open("amazon.json", "r") as fp:
        nodes = json.load(fp)
    
    with open("amazoncon.json", "r") as fp:
        connections = json.load(fp)
    
    return nodes, connections


def save_files(nodes, connections):
    with open("amazon.json", "w") as fp:
        json.dumps(nodes, fp)
    
    with open("amazoncon.json", "w") as fp:
        json.dumps(connections, fp)


@app.route('/getnodes', methods = ['GET'])
def getnodes():
    nodes, connections = load_files()
    nodes = jsonify(nodes)
    nodes.status_code = 200
    return nodes


@app.route('/getconnections', methods = ['GET'])
def getconnections():
    nodes, connections = load_files()
    return jsonify(connections)



if __name__ == "__main__":
    app.run()