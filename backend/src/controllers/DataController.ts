import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DataService } from '../services/data.service';
import { ROUTES } from '../routes/routes.constants';

@ApiTags('Data Export')
@Controller(ROUTES.DATA.BASE)
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get(ROUTES.DATA.EVENTOS)
  @ApiOperation({ summary: 'Listar todos os eventos' })
  async getEventos() {
    return this.dataService.listEventos();
  }

  @Get(ROUTES.DATA.USUARIOS_ORGANIZACAO)
  @ApiOperation({ summary: 'Listar usuários da organização' })
  async getUsuarios() {
    return this.dataService.listUsuariosOrganizacao();
  }

  @Get(ROUTES.DATA.CREDENCIADOS)
  @ApiOperation({ summary: 'Listar todos os credenciados (com relações)' })
  async getCredenciados() {
    return this.dataService.listCredenciados();
  }

  @Get(ROUTES.DATA.ENDERECOS)
  @ApiOperation({ summary: 'Listar todos os endereços' })
  async getEnderecos() {
    return this.dataService.listEnderecos();
  }

  @Get(ROUTES.DATA.ENDERECO_CACHE)
  @ApiOperation({ summary: 'Listar cache de CEPs' })
  async getEnderecoCache() {
    return this.dataService.listEnderecoCache();
  }

  @Get(ROUTES.DATA.DESCARBONIZACAO)
  @ApiOperation({ summary: 'Listar dados de descarbonização' })
  async getDescarbonizacao() {
    return this.dataService.listDescarbonizacao();
  }

  @Get(ROUTES.DATA.CREDENCIAL)
  @ApiOperation({ summary: 'Listar credenciais geradas' })
  async getCredenciais() {
    return this.dataService.listCredenciais();
  }

  @Get(ROUTES.DATA.QR_SCANS)
  @ApiOperation({ summary: 'Listar histórico de scans de QR Code' })
  async getQrScans() {
    return this.dataService.listQrScans();
  }
}
