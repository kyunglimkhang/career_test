from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return {'_result':'hello'}

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000) 