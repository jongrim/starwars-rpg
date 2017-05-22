// @ts-check

$(document).ready(function () {

  let attackerDiv = $("#attacker");
  let defenderDiv = $("#defender");

  let attacker = null;
  let defender = null;

  const attackButton = $("#atk-btn");
  const resetButton = $("#reset-btn");

  attackButton.click(attack);
  resetButton.click(reset);

  
  function allowCharacterSelection() {
    $(".character").on("click", function () {
      $(`#${this.id}`).remove();
      addCharacterToBattle(event);
    });
  }

  function addCharacterToBattle(event) {

    if (!attacker) {
      attackerDiv.append(event.currentTarget.outerHTML);
      attacker = {
        id: event.currentTarget.id,
        attackPower: event.currentTarget.dataset.attack,
        health: event.currentTarget.dataset.health,
        attacks: 1,
        attack: function () {
          return this.attacks * this.attackPower;
        }
      }
    } else {
      defenderDiv.append(event.currentTarget.outerHTML);
      defender = {
        id: event.currentTarget.id,
        attack: event.currentTarget.dataset.counterattack,
        health: event.currentTarget.dataset.health,
      }
      $(".character").off("click");
      prepareBattle();
    }
  }

  function prepareBattle() {
    attackButton.removeAttr('disabled');
    resetButton.removeAttr('disabled');
  }

  function attack() {
    doDamage();
    attacker.attacks++;
    if (attacker.health < 1) {
      endGame();
    }
    if (defender.health < 1) {
      removeCharacter(defender);
    }
    rewriteStats();
  }

  function doDamage() {
    attacker.health -= defender.attack;
    defender.health -= attacker.attack();
  }

  function removeCharacter(obj) {
    $(`#${obj.id}`).remove();
    defender = null;
    allowCharacterSelection();
    attackButton.attr('disabled', 'disabled');
    if ($('#characterRow').find('.character').length < 1) {
      endGame(true);
    }
  }

  function rewriteStats() {
    writeHealthStat(attackerDiv, attacker);
    writeHealthStat(defenderDiv, defender);
    attackerDiv.find(".attack").text(attacker.attack());
  }

  function writeHealthStat(div, obj) {
    div.find(".health").text(() => {
      return obj.health > 0 ? obj.health : 0;
    });
  }

  function endGame(success) {
    if (success) {
      alert('You won');
    } else {
      alert('You lost');
    }
  }

  allowCharacterSelection();
})
