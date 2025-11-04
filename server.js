import { app } from "./app.js";

app.listen(process.env.PORT,()=> {
    console.log(`⚙️  HTTP Server Running on http://localhost:${process.env.PORT}`)
    console.log(`📚  API Docs available on http://localhost:${process.env.PORT}/api-docs`)
})