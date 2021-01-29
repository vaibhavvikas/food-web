import json
from flask import jsonify
from app import app

def load_nodes():
    with open("amazon.json", "r") as file_pointer:
        nodes = json.load(file_pointer)
        return nodes


def load_connections():
    with open("amazoncon.json", "r") as file_pointer:
        connections = json.load(file_pointer)
        return connections


@app.route('/getnodes', methods = ['GET'])
def getnodes():
    nodes = load_nodes()
    nodes = jsonify(nodes)
    nodes.status_code = 200
    return nodes


@app.route('/getconnections', methods = ['GET'])
def getconnections():
    connections = load_connections()
    connections = jsonify(connections)
    connections.status_code = 200
    return connections


if __name__ == "__main__":
    app.run()
