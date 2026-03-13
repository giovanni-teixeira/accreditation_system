import { CriarCredenciadoDto } from '../dtos/request/criar-credenciado.dto';
import { CredenciadoResponseDto } from '../dtos/response/credenciado-response.dto';
import { CredenciadoRepository } from '../repositories/credenciado.repository';
import { EventoRepository } from '../repositories/evento.repository';
export declare class CredenciadosController {
    private readonly credenciadoRepository;
    private readonly eventoRepository;
    constructor(credenciadoRepository: CredenciadoRepository, eventoRepository: EventoRepository);
    cadastrar(dto: CriarCredenciadoDto): Promise<CredenciadoResponseDto>;
    buscarPorCpf(cpf: string): Promise<CredenciadoResponseDto>;
}
