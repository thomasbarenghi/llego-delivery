import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JsonWebTokenError, JwtService } from '@nestjs/jwt'
import type { CreateUserDto } from 'src/users/dto/create-user.dto'
import type { LoginDto } from './dto/login.dto'
import { compare } from 'src/utils/bcryptManager.utils'
import { User } from 'src/users/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { createUser, findUser } from 'src/common/users.common'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async register(
    createUserDto: CreateUserDto
  ): Promise<{ user: any; access_token: string }> {
    const user = await createUser(createUserDto, this.userRepository)
    const token = this.jwtService.sign({
      email: user.email,
      sub: user.id
    })
    delete user.password
    return { user, access_token: token }
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ user: any; access_token: string }> {
    const { email, password } = loginDto
    const user = await findUser(email, this.userRepository)

    if (!user || !(await compare(user.password, password))) {
      throw new UnauthorizedException('Invalid credentials!')
    }

    const token = this.jwtService.sign({
      email: user.email,
      sub: user.id
    })
    delete user.password
    return { user, access_token: token }
  }

  async refreshToken(refreshToken: string): Promise<{ refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET
      })

      const user = await findUser(payload.sub, this.userRepository)
      const newToken = this.jwtService.sign({ email: user.email, sub: user.id })

      return { refresh_token: newToken }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token signature')
      }
      throw new UnauthorizedException('Invalid token')
    }
  }
}
