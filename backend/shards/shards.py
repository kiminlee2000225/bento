import json
import argparse
import itertools

def shard_file(filename, n):
	data = {}
	with open(filename, 'r') as j:
		data = json.load(j)
		data = data['_default']
	
	i = itertools.cycle(range(n)) 
	split = [dict() for _ in range(n)]

	for k, v in data.items():
		split[next(i)][k] = v

	for i, p in enumerate(split):
		to_save = {'_default': p}
		with open("shards_{}.json".format(i), 'w') as wf:
			json.dump(to_save, wf)

if __name__ == '__main__':
	parser = argparse.ArgumentParser(description = "Shard it")
	parser.add_argument('-j', '--json', required=True)
	parser.add_argument('-n', '--num', type=int, required=True)
	args = parser.parse_args()
	shard_file(args.json, args.num)
