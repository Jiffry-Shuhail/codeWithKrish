import { Injectable, OnModuleInit } from '@nestjs/common';
import { Console } from 'console';
import { Kafka } from 'kafkajs';
@Injectable()
export class AppService implements OnModuleInit {
  // OnModuleInit interface implement use onModuleInit method for This module creation time executing

  // Kafka Event Drivent Object Create/Intilize
  // AWS kafka Part IP and Port Eg: IP: 3.0.159.213 | PORT: 9092
  // Possible to Docker image and Kafka in localhost to run
  private readonly Kafka = new Kafka({ brokers: ['3.0.159.213:9092'] });
  // Group ID is must in unique
  private readonly consumer = this.Kafka.consumer({ groupId: 'jiffry-notification-service' });

  async onModuleInit() {
    await this.consumer.connect();
    await this.notified();
  }
  getHello(): string {
    return 'Hello World!';
  }

  async notified() {
    // Producer send the event mention with topic name it's unique, and need to subscribe the cosumer then it will cathup
    await this.consumer.subscribe({ topic: 'jiffry.order.confirmed', fromBeginning: true });

    // Once consumer is subcribe the topic event then we need to call and wrtie logic inside run->method
    await this.consumer.run({
      eachMessage: async ({ message }) => {

        if (message.value) {
          console.log('----- NOTIFICATION SERVICE -----', message.value.toString());

          // Define your ASCII text
          let asciiText = `
   _____ ____  _   _ ______ _____ _____  __  __ ______ _____  
  / ____/ __ \| \ | |  ____|_   _|  __ \|  \/  |  ____|  __ \ 
 | |   | |  | |  \| | |__    | | | |__) | \  / | |__  | |  | |
 | |   | |  | | .   |  __|   | | |  _  /| |\/| |  __| | |  | |
 | |___| |__| | |\  | |     _| |_| | \ \| |  | | |____| |__| |
  \_____\____/|_| \_|_|    |_____|_|  \_\_|  |_|______|_____/
`;


          console.log(` ${asciiText}
            🟢 ${message.value.toString()} ✅`);
        }

      }
    })
  }
}
