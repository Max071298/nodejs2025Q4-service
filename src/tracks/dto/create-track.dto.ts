import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  artistId: string | null; // refers to Artist

  @IsOptional()
  @IsString()
  albumId: string | null; // refers to Album

  @IsNumber()
  duration: number; // integer number
}
