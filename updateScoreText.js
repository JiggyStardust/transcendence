export async function updateScoreText(game) {
  const array = ["0", "1", "2", "3", "4", "5", "6", "7"];
  array.forEach((x) => {
    game.scoreTextLeft = game.scene.getMeshByName("scoreTextLeft" + x);
    game.scoreTextRight = game.scene.getMeshByName("scoreTextRight" + x);

    if (game.scoreP1 == x)
      game.scoreTextLeft.setEnabled(true);
    else
      game.scoreTextLeft.setEnabled(false);
    if (game.scoreP2 == x)
      game.scoreTextRight.setEnabled(true);
    else
      game.scoreTextRight.setEnabled(false);
  });
}
