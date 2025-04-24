export interface NBATeam {
 id: number;
 abbreviation: string;
 city: string;
 conference: string;
 division: string;
 full_name: string;
 name: string;
}

export interface NBAResponse<T> {
 data: T;
}


