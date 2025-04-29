# Billing Application

## RabbitMQ

RabbitMQ is a reliable and mature message broker and streaming platform that is easy to deploy in cloud environments, on-premises, or on your local machine. It is currently used by millions of people worldwide.

### notions rabbitmq

Broker : serveur portant une instance rabbitmq au sein d’un cluster (ensemble de brokers)

Consumer : consommateur de messages après connexion à une queue

Messages : ordonnés ou non, sont composés de metadatas et de données

Channel : élément permettant la connexion des producteurs pour recueillir les messages. Permet de gérer les connexions par multiplexage (plusieurs connexions en une).

Exchange : recueille les messgaes de producteur et a la charge de les router suivant le type d”exchange et de binding. C’est le coeur de l’intelligence de la répartition des messages entrant vers les queues rabbitmq.

Binding : connexion d’un exchange avec une queue.

Queue : ensemble de message avec plus ou moins de haute disponibilité. 

### Message Broker Workflow
```
Producer ---> Broker ---> Queue ---> Consumer
```

### Useful RabbitMQ Commands

To list the existing queues and the number of messages they contain:

```bash
# On Linux
sudo rabbitmqctl list_queues

# On Windows
rabbitmq.bat list_queues
```

---

## Initialization of Packages with Express

To initialize the project and install the required dependencies:

```bash
npm init -y
npm install express amqplib pg dotenv cors helmet
```

### Explanation of Dependencies:
- **express**: A web framework for building web applications and APIs with Node.js.
- **amqplib**: A library for interacting with RabbitMQ.
- **pg**: A PostgreSQL client for Node.js, allowing connections to the database.

---

## PostgreSQL Commands

### Connect to database

```bash
    sudo -i -u postgres
```

### To List Users:
```bash
\du
```

### To Use a Specific User:
```bash
\du <user_name>
```

### To Connect to a Database or List Databases:
```bash
\c <database_name>  # Connect to a database
\l                  # List all databases
```

### To View Tables in a Database:
```bash
\dt
```

---

## Testing the Billing API

### Starting the Server
Run the following command to start the server on port `3002`:
```bash
node server.js
```

This will also start the RabbitMQ server.

### API Endpoints

#### POST Request
Processes a message via RabbitMQ and inserts it into the `billing_db` database. The logic for this is handled in `rabbitmq.js`.

#### GET Request
Fetches the details of the `orders` table:
```bash
http://localhost:3002/billing
```

---

## Additional Notes

- Ensure that RabbitMQ and PostgreSQL are properly configured and running before starting the server.
- Use the provided commands to interact with RabbitMQ and PostgreSQL for debugging or monitoring purposes.

# Using VMs with Vagrant

Vagrant is a VM orchestrator that lets you create VMs on provisioners such as Virtualbox, VmWare Workstation, Hyper-V and even Docker.

Run the following command start the server and connect to Rabbit 

```bash
   vagrant up billing        # to start the billing VM machine
   vagrant provision billing # to start the provision VM machine
   vagrant status billing    # to check the status of the VM
   vagrant ssh billing       # to connect to the vm via SSH
```   

# Manage the VM using PM2

Run the following command to manage the virtual machine

```bash
    pm2 start billing/server.js --attach  # to start the VM and view logs information
    pm2 status billing                   # to check the process
    pm2 delete <process name>          # to delete the process
    pm2 stop <process name>          # to stop the process
```