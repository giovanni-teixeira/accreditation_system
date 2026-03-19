import {
  Controller, Get, Param, Patch, Delete, Body, UseGuards, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { AtualizarUsuarioDto } from '../dtos/request/atualizar-usuario.dto';
import { UsuarioResponseDto } from '../dtos/response/usuario-response.dto';
import { BusinessException } from '../common/exceptions/business.exception';
import { ROUTES } from '../routes/routes.constants';
import * as bcrypt from 'bcrypt';

@ApiTags('Usuários')
@Controller(ROUTES.USUARIOS.BASE)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsuariosController {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários da organização (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários.' })
  async findAll() {
    const result = await this.usuarioRepository.findAll();
    return result.map((u) => new UsuarioResponseDto(u));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findById(@Param('id') id: string) {
    const result = await this.usuarioRepository.findById(id);
    if (!result) throw new BusinessException('Usuário não encontrado.', 404);
    return new UsuarioResponseDto(result);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um usuário (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado.' })
  async update(@Param('id') id: string, @Body() dto: AtualizarUsuarioDto) {
    try {
      const updateData: any = {};
      if (dto.perfilAcesso) updateData.perfilAcesso = dto.perfilAcesso;
      if (dto.setor) updateData.setor = dto.setor;
      if (dto.senhaPura) {
        updateData.senhaHash = await bcrypt.hash(dto.senhaPura, 10);
      }
      const result = await this.usuarioRepository.update(id, updateData);
      return new UsuarioResponseDto(result);
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar usuário (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuário deletado.' })
  async delete(@Param('id') id: string) {
    try {
      await this.usuarioRepository.delete(id);
      return { message: 'Usuário removido com sucesso.' };
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(`Erro ao deletar usuário: ${error.message}`);
    }
  }
}
