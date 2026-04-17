# Database Seed Data: VolleyCoach Core Library (V1.0)

**Source Manual:** VolleyCoach Core Library
**Target Collection:** `drills`
**Format:** Mapped to `DrillSchema`

---

### Drill Entry 1: Traditional Butterfly Drill
* **Title:** Traditional Butterfly Drill
* **Category:** Serve/Receive
* **Level:** débutant
* **Theme:** service, réception
* **Tags:** ["Warm-up", "Passing", "Serving", "High Reps"]
* **durationMinutes:** 15
* **minPlayers:** 6
* **maxPlayers:** 18
* **Purpose:** * Establish a high volume of serve and receive repetitions in a short time.
    * Improve serving accuracy and passing platform angles.
    * Keep all players moving continuously to elevate heart rate.
* **Instructions:**
    1. Divide players into two sides of the net. On each side, establish a Serving line, a Passing target (Setter position), and a Passing line.
    2. Player A serves the ball over the net to Player B in the passing line.
    3. Player B passes the ball to Player C (the target).
    4. Player C catches the ball.
    5. Rotation: Server becomes the Passer, Passer becomes the Target, Target jogs to the other side of the net to join the Serving line.
* **video_url:** null
* **schema_json:**
```json
{
  "matchContext": {"set": 1, "serve": "home", "score": {"home": 0, "away": 0}},
  "players": [
    {"id": 1, "team": "home", "number": 1, "role": "A", "x": 50, "y": 10, "label": "Serveur", "status": "active"},
    {"id": 2, "team": "home", "number": 2, "role": "R", "x": 50, "y": 70, "label": "Récepteur", "status": "active"},
    {"id": 3, "team": "home", "number": 3, "role": "P", "x": 50, "y": 50, "label": "Passeur/Cible", "status": "active"},
    {"id": 4, "team": "away", "number": 4, "role": "A", "x": 50, "y": 85, "label": "Serveur Away", "status": "active"}
  ],
  "ball": {"x": 50, "y": 5},
  "targets": [{"x": 50, "y": 50, "type": "zone_reception", "intensity": 1.0}]
}
```
* **sourceManual:** "VolleyCoach Core Library"

---

### Drill Entry 2: Queens of the Court (Wash Drill)
* **Title:** Queens/Kings of the Court
* **Category:** Gameplay
* **Level:** intermédiaire
* **Theme:** rotation, jeu complet
* **Tags:** ["Competitive", "Transition", "6v6", "3v3"]
* **durationMinutes:** 20
* **minPlayers:** 6
* **maxPlayers:** 12
* **Purpose:** * Foster a competitive mindset and simulate game-point pressure.
    * Improve out-of-system play and rapid transitions.
* **Instructions:**
    1. Split the team into groups of 3 to 6 players. One side of the court is the "Queens" (or Kings) side, the other is the "Challenger" side.
    2. The Coach initiates a free ball or down-ball to the Challenger side.
    3. The teams play out the point. If the Queens win, they stay and get a point. If the Challengers win, they immediately sprint under the net to replace the Queens, and a new Challenger team steps on.
    4. First team to 5 points on the Queens side wins the round.
* **video_url:** null
* **schema_json:**
```json
{
  "matchContext": {"set": 1, "serve": "away", "score": {"home": 2, "away": 1}},
  "players": [
    {"id": 1, "team": "home", "number": 1, "role": "P", "x": 40, "y": 30, "label": "Queens Setter", "status": "active"},
    {"id": 2, "team": "home", "number": 2, "role": "A", "x": 20, "y": 20, "label": "Queens Attacker", "status": "active"},
    {"id": 3, "team": "home", "number": 3, "role": "B", "x": 60, "y": 20, "label": "Queens Middle", "status": "active"},
    {"id": 4, "team": "away", "number": 4, "role": "P", "x": 40, "y": 70, "label": "Challenger Setter", "status": "active"},
    {"id": 5, "team": "away", "number": 5, "role": "A", "x": 20, "y": 80, "label": "Challenger Attacker", "status": "active"},
    {"id": 6, "team": "away", "number": 6, "role": "B", "x": 60, "y": 80, "label": "Challenger Middle", "status": "active"}
  ],
  "ball": {"x": 50, "y": 50},
  "targets": []
}
```
* **sourceManual:** "VolleyCoach Core Library"

---

### Drill Entry 3: Mikan Setting Triangle
* **Title:** Mikan Setting Triangle
* **Category:** Setting
* **Level:** débutant
* **Theme:** passe
* **Tags:** ["Footwork", "Setters", "Hands", "Warm-up"]
* **durationMinutes:** 10
* **minPlayers:** 3
* **maxPlayers:** 3
* **Purpose:** * Develop quick feet and squaring up to the target for setters.
    * Improve hand shape and release speed.
* **Instructions:**
    1. Three players form a triangle about 10 feet apart. One player (the worker) is at the net, the other two are tossers in the backcourt.
    2. Tosser 1 throws a high ball to the worker.
    3. The worker must move their feet, square their shoulders to Tosser 2, and set the ball cleanly to them.
    4. Tosser 2 catches, and immediately Tosser 1 tosses again.
    5. The worker sets for 60 seconds continuously before rotating positions.
* **video_url:** null
* **schema_json:**
```json
{
  "matchContext": {"set": 1, "serve": "home", "score": {"home": 0, "away": 0}},
  "players": [
    {"id": 1, "team": "home", "number": 1, "role": "P", "x": 50, "y": 30, "label": "Setter (Worker)", "status": "active"},
    {"id": 2, "team": "home", "number": 2, "role": "R", "x": 30, "y": 70, "label": "Tosser 1", "status": "active"},
    {"id": 3, "team": "home", "number": 3, "role": "R", "x": 70, "y": 70, "label": "Tosser 2", "status": "active"}
  ],
  "ball": {"x": 30, "y": 60},
  "targets": [
    {"x": 50, "y": 30, "type": "zone_setter", "intensity": 1.0},
    {"x": 70, "y": 70, "type": "zone_cible", "intensity": 0.8}
  ]
}
```
* **sourceManual:** "VolleyCoach Core Library"

---

### Drill Entry 4: Hitting Lines - Out of System
* **Title:** Out of System High Ball Attack
* **Category:** Attack
* **Level:** intermédiaire
* **Theme:** attaque
* **Tags:** ["Hitting", "Out of System", "Footwork"]
* **durationMinutes:** 15
* **minPlayers:** 4
* **maxPlayers:** 12
* **Purpose:** * Train attackers to aggressively approach and swing at imperfect, high sets.
    * Improve timing and broad jump mechanics.
* **Instructions:**
    1. Form an attacking line at the left pin (Outside Hitter) and right pin (Opposite).
    2. The Coach stands near the 10-foot line (3-meter line) in the middle of the court.
    3. The Coach intentionally tosses a high, somewhat erratic ball to the pins.
    4. The attacker must adjust their approach, communicate, and take a controlled, aggressive swing deep into the court.
    5. Attackers shag their own ball and rotate to the other pin.
* **video_url:** null
* **schema_json:**
```json
{
  "matchContext": {"set": 1, "serve": "home", "score": {"home": 0, "away": 0}},
  "players": [
    {"id": 1, "team": "home", "number": 1, "role": "A", "x": 20, "y": 10, "label": "Attacker Left", "status": "active"},
    {"id": 2, "team": "home", "number": 2, "role": "A", "x": 80, "y": 10, "label": "Attacker Right", "status": "active"}
  ],
  "ball": {"x": 50, "y": 40},
  "targets": [
    {"x": 20, "y": 80, "type": "zone_attaque", "intensity": 0.9},
    {"x": 80, "y": 80, "type": "zone_attaque", "intensity": 0.9}
  ]
}
```
* **sourceManual:** "VolleyCoach Core Library"

---

### Drill Entry 5: Defensive Dig-Set-Hit
* **Title:** Transition Dig-Set-Hit
* **Category:** Defense
* **Level:** avancé
* **Theme:** défense, transition
* **Tags:** ["Transition", "Digging", "Base Defense"]
* **durationMinutes:** 20
* **minPlayers:** 6
* **maxPlayers:** 12
* **Purpose:** * Teach players how to transition from base defense to offensive attack instantly.
    * Practice digging hard-driven balls perfectly to the target area.
* **Instructions:**
    1. Setup a standard 6-person defense on one side. The Coach is on a box on the opposite side of the net.
    2. Coach slaps the ball; the defense drops into base position.
    3. Coach hits a hard down-ball at a back-row defender.
    4. The defender digs to the setter.
    5. The setter pushes the ball to an attacker, who takes a full swing.
    6. Reset immediately after the swing.
* **video_url:** null
* **schema_json:**
```json
{
  "matchContext": {"set": 1, "serve": "home", "score": {"home": 0, "away": 0}},
  "players": [
    {"id": 1, "team": "home", "number": 1, "role": "B", "x": 35, "y": 25, "label": "Middle Blocker", "status": "active"},
    {"id": 2, "team": "home", "number": 2, "role": "A", "x": 20, "y": 25, "label": "Outside Blocker", "status": "active"},
    {"id": 3, "team": "home", "number": 3, "role": "A", "x": 50, "y": 25, "label": "Opposite Blocker", "status": "active"},
    {"id": 4, "team": "home", "number": 4, "role": "P", "x": 35, "y": 50, "label": "Setter", "status": "active"},
    {"id": 5, "team": "home", "number": 5, "role": "R", "x": 20, "y": 60, "label": "Libero", "status": "active"},
    {"id": 6, "team": "home", "number": 6, "role": "R", "x": 50, "y": 60, "label": "Defender", "status": "active"}
  ],
  "ball": {"x": 50, "y": 20},
  "targets": [
    {"x": 35, "y": 50, "type": "zone_setter", "intensity": 1.0},
    {"x": 20, "y": 85, "type": "zone_attaque", "intensity": 0.8}
  ]
}
```
* **sourceManual:** "VolleyCoach Core Library"

---

### Drill Entry 6: Continuous Pepper
* **Title:** Dynamic Continuous Pepper
* **Category:** Warm-up
* **Level:** débutant
* **Theme:** contrôle
* **Tags:** ["Ball Control", "Partner Drill", "Communication"]
* **durationMinutes:** 8
* **minPlayers:** 2
* **maxPlayers:** 14
* **Purpose:** * Warm up shoulders, platform, and footwork.
    * Emphasize accurate ball control in a 3-touch sequence (Pass, Set, Hit).
* **Instructions:**
    1. Players pair up across from each other, about 15 feet apart.
    2. Player A tosses a free ball to Player B.
    3. Player B passes to Player A.
    4. Player A sets the ball back to Player B.
    5. Player B takes a controlled standing arm swing (hit) at Player A.
    6. Player A digs the hit, and the sequence continues indefinitely.
* **video_url:** null
* **schema_json:**
```json
{
  "matchContext": {"set": 1, "serve": "home", "score": {"home": 0, "away": 0}},
  "players": [
    {"id": 1, "team": "home", "number": 1, "role": "R", "x": 25, "y": 50, "label": "Player A", "status": "active"},
    {"id": 2, "team": "home", "number": 2, "role": "R", "x": 75, "y": 50, "label": "Player B", "status": "active"}
  ],
  "ball": {"x": 50, "y": 50},
  "targets": []
}
```
* **sourceManual:** "VolleyCoach Core Library"

---

### Drill Entry 7: Blocker Footwork & Sealing
* **Title:** Middle Blocker Footwork Series
* **Category:** Defense
* **Level:** intermédiaire
* **Theme:** bloc
* **Tags:** ["Blocking", "Footwork", "Middle Blocker"]
* **durationMinutes:** 10
* **minPlayers:** 2
* **maxPlayers:** 6
* **Purpose:** * Develop fast, explosive crossover footwork for Middle Blockers.
    * Teach players to press hands over the net and seal the space.
* **Instructions:**
    1. Middle Blocker starts in base position at the center of the net.
    2. Coach points left or right.
    3. Blocker executes a 3-step crossover move to the designated pin.
    4. Blocker jumps, pressing hands forcefully over the tape.
    5. Blocker lands on two feet, immediately turns, and uses crossover steps to return to base.
    6. Perform 10 reps per player.
* **video_url:** null
* **schema_json:**
```json
{
  "matchContext": {"set": 1, "serve": "home", "score": {"home": 0, "away": 0}},
  "players": [
    {"id": 1, "team": "home", "number": 1, "role": "B", "x": 50, "y": 30, "label": "Middle Blocker", "status": "active", "direction": 0}
  ],
  "ball": null,
  "targets": [
    {"x": 20, "y": 30, "type": "zone_bloc_left", "intensity": 0.8},
    {"x": 80, "y": 30, "type": "zone_bloc_right", "intensity": 0.8}
  ]
}
```
* **sourceManual:** "VolleyCoach Core Library"

---

### Drill Entry 8: Block Jumps & Suicides
* **Title:** Net Jumps to Suicides
* **Category:** Conditioning
* **Level:** avancé
* **Theme:** endurance
* **Tags:** ["Cardio", "Anaerobic", "Leg Strength"]
* **durationMinutes:** 12
* **minPlayers:** 1
* **maxPlayers:** 15
* **Purpose:** * Build explosive leg power and anaerobic endurance for late-game scenarios.
* **Instructions:**
    1. Players line up at the center of the net.
    2. On the whistle, players execute 5 maximum-height consecutive block jumps.
    3. Upon landing the 5th jump, players turn and sprint a standard volleyball suicide: 10-foot line and back, half-court and back, opposite 10-foot line and back, opposite baseline and back.
    4. Rest for 45 seconds. Repeat 5 times.
* **video_url:** null
* **schema_json:** null
* **sourceManual:** "VolleyCoach Core Library"

---

### Drill Entry 9: Serve Receive W-Formation
* **Title:** W-Formation Seam Passing
* **Category:** Serve/Receive
* **Level:** avancé
* **Theme:** réception, communication
* **Tags:** ["Serve Receive", "Tactical", "Communication"]
* **durationMinutes:** 15
* **minPlayers:** 6
* **maxPlayers:** 12
* **Purpose:** * Train primary passers to identify their responsibilities in a 5-man receive.
    * Work on communication ("Mine!", "Short!") when balls drop in the seams.
* **Instructions:**
    1. Position 5 players in a standard W-Formation on receive. The setter stands at the net.
    2. Three servers line up on the opposite baseline.
    3. Servers aggressively serve short, deep, and into the seams between players.
    4. Passers must audibly call the ball early and pass a "3-ball" (perfect pass) to the setter.
    5. Goal is 20 perfect passes before rotating the receiving squad.
* **video_url:** null
* **schema_json:**
```json
{
  "matchContext": {"set": 1, "serve": "away", "score": {"home": 0, "away": 0}},
  "players": [
    {"id": 1, "team": "home", "number": 1, "role": "R", "x": 20, "y": 70, "label": "Left Passer", "status": "active"},
    {"id": 2, "team": "home", "number": 2, "role": "R", "x": 50, "y": 65, "label": "Center Passer", "status": "active"},
    {"id": 3, "team": "home", "number": 3, "role": "R", "x": 80, "y": 70, "label": "Right Passer", "status": "active"},
    {"id": 4, "team": "home", "number": 4, "role": "R", "x": 35, "y": 85, "label": "Deep Left", "status": "active"},
    {"id": 5, "team": "home", "number": 5, "role": "R", "x": 65, "y": 85, "label": "Deep Right", "status": "active"},
    {"id": 6, "team": "home", "number": 6, "role": "P", "x": 50, "y": 40, "label": "Setter", "status": "active"},
    {"id": 7, "team": "away", "number": 7, "role": "A", "x": 50, "y": 5, "label": "Serveur", "status": "active"}
  ],
  "ball": {"x": 50, "y": 10},
  "targets": [
    {"x": 50, "y": 40, "type": "zone_setter", "intensity": 1.0},
    {"x": 20, "y": 70, "type": "seam_left", "intensity": 0.5},
    {"x": 50, "y": 65, "type": "seam_center", "intensity": 0.5},
    {"x": 80, "y": 70, "type": "seam_right", "intensity": 0.5}
  ]
}
```
* **sourceManual:** "VolleyCoach Core Library"
