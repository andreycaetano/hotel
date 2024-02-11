import { app } from './app';

app.listen(process.env.PORT, () => console.log(`Application started on port ${process.env.PORT} successfully!`));
