import { app } from './app';
import { main } from './database';

app.listen(() => {
    console.log(`Application started!`)
    main()
});
