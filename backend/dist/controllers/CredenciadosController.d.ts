import { CriarCredenciadoDto } from '../dtos/request/criar-credenciado.dto';
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
    buscarPorCpf(cpf: string): Promise<CredenciadoResponseDto>;
}
