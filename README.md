# What is coronncet
Coronncet is a http client library that provides low-level access to TCP connection.
Its made with TypeScript and built with Rollup so it
supports both commonjs and es.

# Features of coronncet
* Its directly made on top of Node.js TCP API.
* It supports both HTTP and HTTPS. (TLSv1.2 and TLSv1.3)
* Doesn't close the connection after each request.
* It supports both High and Low level API.
* It has types by TypeScript.
* It supports HTTP/1.1.

# Low level API
```typescript
import { connection } from 'coronncet';

const conn = connection('https://www.example.com');
conn.connect(); // Async function
const resp = await conn.get('/'); // Async function
conn.disconnect(); // Async function
```

1. We are creating a connection object 
2. We are calling `connect()` on the connection object.
3. We are calling `get()` on the connection object and returns the response object.
4. We are calling `disconnect()` on the connection object.

## Connection
Is the class that responsible for creating a connection and maintaining it.
```tpyeScript
connection(Url: string): Connection;
```

### .connect()
Connects to the server. It returns a promise that resolves when the connection is established.
if the connection is already established, it returns a promise that resolves immediately.

if it returns with true, it means the connection is established.

```typescript
connection.connect(): Promise<boolean>;
```

### .setHeader(key, value)
Sets the header for the requests that will be sent to the server.

```typescript
connection.setHeader(key: string, value: string | number): void;
```

### .get(path)
Sends a GET request to the server for the given path.
Its returns a promise that resolves when the response is received.

```typescript
connection.get(path: string): Promise<Response>;
```

### .disconnect()
Disconnects from the server. Its same as the `connect()` function.

```typescript
connection.disconnect(): Promise<boolean>;
```

### .connected 
Type of boolean, default is `false`. It indicates whether the connection is established or not. Protected veriable

### .headers 
Type of object, default is `{}`. It contains the headers that will be sent to the server.

## Response
Is the class that responsible for handling the response.

### .getRaw()
Returns the raw body of the response. if the response is not fully received, it throw error.

```typescript
response.getRaw(): Buffer;
```

### .getText(Encoding)
Returns the body of the response as a string. With encoded as the parameter of the function. Default is `ascıı`.

```typescript
response.getText(encoding: string): string;
```

### .statusCode
Type of number. It contains the status code of the response.

### .headers
Type of object. It contains the headers of the response.