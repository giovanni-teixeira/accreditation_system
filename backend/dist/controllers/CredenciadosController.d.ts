import { CriarCredenciadoDto } from '../dtos/request/criar-credenciado.dto';
import { AtualizarCredenciadoDto } from '../dtos/request/atualizar-credenciado.dto';
import { CredenciadoResponseDto } from '../dtos/response/credenciado-response.dto';
import { CredenciadoRepository } from '../repositories/credenciado.repository';
import { EventoRepository } from '../repositories/evento.repository';
import { AddressService } from '../services/address.service';
export declare class CredenciadosController {
    private readonly credenciadoRepository;
    private readonly eventoRepository;
    private readonly addressService;
    constructor(credenciadoRepository: CredenciadoRepository, eventoRepository: EventoRepository, addressService: AddressService);
    cadastrar(dto: CriarCredenciadoDto): Promise<CredenciadoResponseDto>;
    findAll(): Promise<CredenciadoResponseDto[]>;
    buscarPorCpf(cpf: string): Promise<CredenciadoResponseDto>;
    findById(id: string): Promise<CredenciadoResponseDto>;
    update(id: string, dto: AtualizarCredenciadoDto): Promise<CredenciadoResponseDto>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
