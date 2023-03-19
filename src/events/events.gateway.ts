import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Socket } from 'socket.io';
import { LetsChatDTO } from './dto/let-chat-event.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private readonly eventsService: EventsService) { }

  @SubscribeMessage('createEvent')
  create(@MessageBody() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @SubscribeMessage('findAllEvents')
  findAll() {
    console.log('this ran');

    return this.eventsService.findAll();
  }

  @SubscribeMessage('findOneEvent')
  findOne(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    return this.eventsService.findOne(id);
  }

  @SubscribeMessage('chat')
  letsChat(
    @MessageBody() data: LetsChatDTO,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(client.id);
    const { message, room } = data;
    client.join(room)
    client.to(room).emit('chat', message);
  }

  @SubscribeMessage('updateEvent')
  update(@MessageBody() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(updateEventDto.id, updateEventDto);
  }

  @SubscribeMessage('removeEvent')
  remove(@MessageBody() id: number) {
    return this.eventsService.remove(id);
  }
}
