import { Message } from '../lib/util';

export default new Message(
    'NAME',
    'READABLE NAME',
)
    .content((client) => { return { content: 'Hello, World!' } });