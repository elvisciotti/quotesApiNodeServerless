# Quotes Api - Node.JS + SQLite on AWS lambda

RESTful endpoint to get quotes

Tech stack
* Node.js 12, Express.js
* SQLIte 3
* AWS lambda (Serverless)
* Docker

See the [detailed article](https://medium.com/@elvisciotti/how-to-create-a-serverless-microservice-node-js-sqlite-44888abb3847) I wrote on medium.com 

# Endpoints

    curl /tags
    ["age","alone"]
    
    # get one random quote
    curl /quotes
    [{"quote":"Those who ..","author":"Jean Giraudoux","tag":"smile"}]
    
    # two quotes
    curl /quotes?limit=2
    # filter by tag
    curl "/quotes?limit=2&tags=smile"

# Local run
    docker-compose up --build

`db/quotes.db` will be created based on CSV files

test with
 
    `curl http://localhost:3001/tags`

(note: internal port is 3000, see `docker-compose.yml`)

# Deploy (AWS)

    sls deploy

# Troubleshooting
 * internal server error:
   [invoke](https://us-east-1.console.aws.amazon.com/apigateway/home?region=us-east-1) from Amazon, and the error log will show the details
