import json

data = json.load(open('NAC.json'))

for value in data:
	print 'curl -X POST "http://iecsmapa.apidone.com/pathologies/NAC/studies" -d \'%s\' -H "Content-Type: application/json"' % json.dumps(value).replace('\n', '')