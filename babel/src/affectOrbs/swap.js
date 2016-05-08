swap(swapOrbs, playerSwap = true) {
        let [[row1, col1], [row2, col2]] = swapOrbs;
        let orbsBefore = _.cloneDeep(this.orbs);
        this.orbs[row1][col1] = orbsBefore[row2][col2]
        this.orbs[row2][col2] = orbsBefore[row1][col1]

        // undo the swap if it did not yeild a match
        if (playerSwap && !this.hasMatch()) {
            this.orbs = orbsBefore;
        };
    }