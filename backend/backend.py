from tinydb import TinyDB, Query
import re
from flask import Flask, request
from flask_cors import CORS
from string import digits
from multiprocessing import Process, Queue

app = Flask(__name__)
CORS(app)
shards_num = 10

q = Queue()
# db = TinyDB("all_recipes.json")
dbs = [None] * shards_num
for i in range(shards_num):
	dbs[i] = TinyDB("shards/shards_{}.json".format(i))
Match = Query()

default_ingredients = ["pepper", "salt", "sugar", "flour", "oil"]

def mult_proc_func(database, func, items):
	q.put(database.search(Match.ingredients.test(func, items)))

def test_contain(val, items):
	count = 0
	for v in val:
		for i in items:
			remove_num = str.maketrans('', '', digits)
			i = i.translate(remove_num)
			if i in v and len(i) > 2:
				count += 1
				break
	return count == len(val)


# Same method but for testing locally without POST method
def debug_search(items):
	items = tuple(items + default_ingredients)
	proc = [Process(target=mult_proc_func,args=(db,test_contain, items)) for db in dbs]
	[p.start() for p in proc]
	[p.join() for p in proc]

	a = []
	while q.qsize() > 0:
		a += q.get()
	try:
		return {'recipes': a}
	except:
		return {}

@app.route("/recipe", methods=['POST'])
def search_and_contain():
	items = tuple(default_ingredients + request.json["keywords"])
	proc = [Process(target=mult_proc_func,args=(db,test_contain, items)) for db in dbs]
	[p.start() for p in proc]
	[p.join() for p in proc]

	a = []
	while q.qsize() > 0:
		a += q.get()
	try:
		return {'recipes': a}
	except:
		return {}


if __name__ == '__main__':
	items = ["butter",
		"white wine",
		"lemon juice",
		"dried parsley",
		"cayenne pepper",
		"minced garlic",
		"bread crumbs",
		"large shrimp",
		"chicken",
		"1"]
	debug_search(items)

	# items = [
 #        "1 pound large shrimp, peeled and deveined",
 #        "1 cup unsalted butter",
 #        "1/4 cup white wine",
 #        "2 tablespoons lemon juice",
 #        "2 tablespoons dried parsley",
 #        "1 teaspoon cayenne pepper",
 #        "2 tablespoons minced garlic",
 #        "1/2 cup Italian-seasoned bread crumbs"
 #      ]
