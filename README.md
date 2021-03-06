# Godsend
Simple and elegant message streaming for microservices

### Key Features

- Streaming: send messages to the bus as a stream and process messages as a stream.
- Mutable composition: inject message processors from any location in your project to decouple concerns such as validation and transformation.
- Multiple message processors are able to process, filter, and transform a particular message request in a controlled, composed order.
- The secure messaging exchange learns authorization automatically (with exercise).
- Message processors may be versioned according to the connected user. Processor versions are dynamically substituted in the processor list upon each user's request.
- Property-based message patterns.
- A clean, concise, yet expressive API
- Few assumptions
   - Universal/isomorphic (in the browser and in Node.js)
   - The messaging scheme is totally open and configurable per processor and is not necessary predetermined to use wildcards or regular expressions for pattern matching. But you can. The default and intended scheme is to match multiple property/value pairs within an object.

### Online Examples

[Godsend Examples @ Runkit](https://www.notion.so/Examples-0ceecf7945ac4b198c340fbf36075cda)

### Getting Started

`npm install godsend`

`npm install godsend-examples`

Initially, you likely want to install and run the godsend-examples and not godsend itself.

- This project is not currently suitable for production.
- Security, error handling, and fault tolerance need more evaluation.

https://www.notion.so/Messaging-30c17b4e590f44689d9571f1f1f690c0

### Public Development @ Cloud9

[Cloud9 Preview](https://preview.c9users.io/simplygreatwork/godsend/godsend/)

[Sign-in | Cloud9 IDE - Ajax.org](https://ide.c9.io/simplygreatwork/godsend/)
