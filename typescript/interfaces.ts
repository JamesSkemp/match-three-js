interface BasicBoard {
	width: number,
	height: number,
	types: any[],
	orbs: any[],
	size: number[],
	availableTypes: any[],
	triples: [number[]],
	matches: [number[]],
	attic: Attic, 
	generateOrbs(): void,
	evaluate(): MatchData,
	needsShuffle(): boolean,
	hasPotentialMatch(): boolean,
	hasMatch(): boolean,
	swap(): void,
	unmatch(): void,
	shuffle(): void
}

export interface MatchData {
	'0': any,
	'1': number 
}

export interface Attic extends BasicBoard {}

export interface Board extends BasicBoard {
	attic: Attic
}