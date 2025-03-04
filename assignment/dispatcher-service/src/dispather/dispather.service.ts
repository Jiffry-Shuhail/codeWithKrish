import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateDispatherDto } from './dto/create-dispather.dto';
import { UpdateDispatherDto } from './dto/update-dispather.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispather } from './entities/dispather.entity';
import { Repository } from 'typeorm';
import { Kafka } from 'kafkajs';
import { Redis } from 'ioredis';

@Injectable()
export class DispatherService implements OnModuleInit {
  // OnModuleInit interface implement use onModuleInit method for This module creation time executing

  private readonly redis = new Redis({ host: '3.0.159.213', port: 6379 });

  // Kafka Event Drivent Object Create/Intilize
  // AWS kafka Part IP and Port Eg: IP: 3.0.159.213 | PORT: 9092
  // Possible to Docker image and Kafka in localhost to run
  private readonly Kafka = new Kafka({ brokers: ['3.0.159.213:9092'] });
  // Group ID is must in unique
  private readonly consumer = this.Kafka.consumer({ groupId: 'jiffry-dispatcher-service' });

  constructor(@InjectRepository(Dispather) private readonly dispatcherRepository: Repository<Dispather>) { }
  async onModuleInit() {
    await this.consumer.connect();
    await this.dispatch();
  }

  async create(createDispatherDto: CreateDispatherDto): Promise<Dispather> {
    const dispatcher = this.dispatcherRepository.create(createDispatherDto)
    return await this.dispatcherRepository.save(dispatcher);
  }

  async findAll(): Promise<Dispather[] | []> {
    return await this.dispatcherRepository.find();;
  }

  async findOne(city: string): Promise<Dispather[] | []> {
    const dispathers = await this.dispatcherRepository.find({ where: { city } });

    if (!dispathers || dispathers.length === 0) {
      // throw new NotFoundException(`Dispatcher with city: ${city} is not have any records`);
    }
    return dispathers;
  }

  async unlock(vehicle_number:string):Promise<any>{
    const lockKey = `jiffry:dispatcher:${vehicle_number}:lock`;
    await this.redis.del(lockKey);
    return {message:'Order Delivered'}
  }

  async dispatch() {
    // Producer send the event mention with topic name it's unique, and need to subscribe the cosumer then it will cathup
    await this.consumer.subscribe({ topic: 'jiffry.order.confirmed', fromBeginning: true });

    // Once consumer is subcribe the topic event then we need to call and wrtie logic inside run->method
    await this.consumer.run({
      eachMessage: async ({ message }) => {

        if (message.value) {
          console.log('----- DISPATCHER SERVICE -----', message.value.toString());

          const { city, orderId } = JSON.parse(message.value.toString());

          const dispatchers = await this.findOne(city);

          // Google Copy and Past Text Just for Fun!
          let asciiText = `
 ██████  ██████  ███    ██ ███████ ██ ██████  ███    ███ ███████ ██████  
██      ██    ██ ████   ██ ██      ██ ██   ██ ████  ████ ██      ██   ██ 
██      ██    ██ ██ ██  ██ █████   ██ ██████  ██ ████ ██ █████   ██   ██ 
██      ██    ██ ██  ██ ██ ██      ██ ██   ██ ██  ██  ██ ██      ██   ██ 
 ██████  ██████  ██   ████ ██      ██ ██   ██ ██      ██ ███████ ██████  
                                                                                                                                                 
`;


          console.log(` ${asciiText}
            🟢 Cool! ✅`);


          if (dispatchers && dispatchers.length > 0) {

            let vehicleExist=false;
            for (const dispatcher of dispatchers) {
              const lockKey = `jiffry:dispatcher:${dispatcher.vehicle_number}:lock`;
              const lock = await this.redis.set(lockKey, 'lock', 'EX', 3600 * 24, 'NX');
              if (lock) {
                vehicleExist=true;
                console.log(`**** Vehicle allocated for order ${orderId} ****`);
                break;
              }
            }

            if(!vehicleExist){
              console.log(`**** All vehicles occupied ****`);
            }

          } else {
            console.log(`**** Cannot find vehicle for order, Order ID: ${orderId} | City: ${city} ****`);
          }

        }

      }
    })
  }

}
