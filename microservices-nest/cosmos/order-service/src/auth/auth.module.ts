import { Module } from '@nestjs/common';
import { JwtStratergy } from './jwt.stratergy';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports:[PassportModule.register({defaultStrategy:'jwt'})],
    providers:[JwtStratergy],
    exports:[PassportModule]
})
export class AuthModule {}
