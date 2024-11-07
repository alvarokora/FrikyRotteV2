// games-params-options.interface.ts

export type filterBy = "new-releases" | "coming-soon" | "available";
export type platform = "ps5" | "ps4" | "xbox-series-x" | "xboxone" | "switch" | "pc" | "ios" | "stadia";
export type sortBy = "date" | "metascore" | "name" | "userscore";

/**
 * Interface for the options passed to getGameReviews
 */
export interface GamesParamsOptions {
    filterBy: filterBy;
    platform: platform;
    sortBy: sortBy;
}
