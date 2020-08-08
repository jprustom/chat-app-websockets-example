import http from 'http';
import chalk from 'chalk';
import {app} from './tools/app';

const port = process.env.PORT || 3000;

export const server:http.Server = http.createServer(app);
import './tools/socket'

server.listen(port,()=>{
    console.log(chalk.bold.green(`Listening on port ${port}`))
});