from tinydb import TinyDB, Query
import re
from spellchecker import SpellChecker
from flask import Flask, request
from flask_cors import CORS
from string import digits

app = Flask(__name__)
CORS(app)

spell = SpellChecker()
db = TinyDB("all_recipes_updated.json")
Match = Query()

def correct_spelling(items):
	corrected_items = items
	for idx, i in enumerate(items):
		corrected_items = items[:idx] + (spell.correction(i), ) \
		 + items[idx+1:]

	return corrected_items

# Same method but for testing locally without POST method
def debug_search(items):
	items = tuple(items)
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

	a = db.search(Match.ingredients.test(test_contain, items))
	try:
		print(len(a))
		return {'recipes': a}
	except:
		return {}

@app.route("/recipe", methods=['POST'])
def search_and_contain():
	items = tuple(request.json["keywords"])
	# too slow
	# items = correct_spelling(items)
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

	a = db.search(Match.ingredients.test(test_contain, items))
	try:
		# if you want all the result, change it to a
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
