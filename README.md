# match-three-js

An engine for driving [a "match three" game](https://en.wikipedia.org/wiki/Category:Match_3_games), written in Javascript. Allows for plenty of customization, but defaults to mimic the match three system found in [*Gems of War*](https://www.youtube.com/watch?v=GGWdqf1BnXo&t=13s). This app is meant to be used as a core engine for a match three game, meaning that it contains no business logic concerning turns, or stats. This module only handles the moving, matching, removing, replenishing, and shuffling of "orbs". Orbs are the units that populate the board, and must be matched in groups of three or more to be removed from the board.

##### Features

This list highlights a typical turn in a game of a match three style game. It also conveniently highlights the features of this module.

1. Populates an initial board of orbs in a state that has no matches currently, but has at least one potential match.
0. Orb values are customizable. They default to integers 0 through 7.
0. Board sizes are customizable. They default to 8x8 in size.
0. Boards support "swapping", which move one orb to another adjacent square (not diagonal) to attempt a match.
0. Boards scan for matches after swap calls. Any locations on the board that have a consecutive 3+ run of the same orb in a row are "matched".
0. Matched orbs are tallied, and removed. You are given an object informing you of what orbs were removed, and where, for animation purposes.
0. Matched orbs are replaced from above with new orbs (gravity defaults to "down"). What type of orbs drop in is random by default, but can be configured.
0. After new orbs drop in, more matches are searched for. Any matches found are returned to you for animation purposes.
0. This cycle continues until there are no more matches available.
0. If there are zero potential matches, the board is shuffled until there are no current board matches, but at least one potential match.
0. Control of the board is returned to the consumer.


# License

This application under [the MIT License](./LICENSE).
