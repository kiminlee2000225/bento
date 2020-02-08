import pip
import requests
from bs4 import BeautifulSoup
from collections import deque
from tinydb import TinyDB, Query
import logging

global_links = deque()
visited = set()
db = TinyDB('all_recipes2.json')

class Recipe:
    def __init__(self, name, ingredients, directions, times, image):
        self.name = name
        self.ingredients = ingredients
        self.directions = directions
        self.times = times
        self.image = image

    def serialize(self):
        return {'name': self.name, 'ingredients': self.ingredients, 'directions': self.directions, 'times': self.times, 'image':self.image}

    def __str__(self):
        return "name: {}\ningredients: {}\ndirections: {}\ntimes: {}\nimage: {}".format(self.name, self.ingredients, self.directions, self.times, self.image)

def get_info(URL):
    r = requests.get(URL)

    soup = BeautifulSoup(r.content, 'html.parser')
    ingredients = []
    directions = []

    # Finding the ingridients
    for labels in soup.findAll('li', {'class':'checkList__line'})[0:-3]:
        for a in labels.select('label'):
            for l in a.select('span'):
                ingredients.append(l.text)

    # Finding the name of the food
    foodName = soup.find('h1').text

    for d in soup.findAll('ol', {'class':'recipe-directions__list'}):
        for steps in d.select('li'):
            directions.append(steps.text.strip())
        
    times = [a.text.strip() for a in soup.select('span.prepTime__item--time')]

    image = soup.select('img.rec-photo')[0]['src']

    links = soup.select('div.slider-card')
    for card in links:
        for a in card:
            try:
                link = a['href'].strip()
                if 'https://www.allrecipes.com/recipe/' not in a['href']:
                    continue
                global_links.append(link)
            except:
                continue

    hi = Recipe(foodName, ingredients, directions, times, image)
    db.insert(hi.serialize())

if __name__ == '__main__':
    global_links.append("https://www.allrecipes.com/recipe/229959/baked-shrimp-scampi/?internalSource=streams&referringId=15853&referringContentType=Recipe%20Hub&clickId=st_trending_b")
    while len(global_links) > 0 and len(visited) < 1000:
        link = global_links.pop()
        if link not in visited:
            visited.add(link)
            try:
                get_info(link)
            except:
                logging.info("LINK BROKEN: {}".format(link))

    '''
    1. Since tinydb is not a threadsafe add a lock on it
    2. consistent hashing
    '''