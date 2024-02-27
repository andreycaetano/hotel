import { app } from './app';
import { main } from './database';

app.listen(process.env.PORT, () => {
    main()
    console.log(`Application started on port ${process.env.PORT} successfully!`)
});
