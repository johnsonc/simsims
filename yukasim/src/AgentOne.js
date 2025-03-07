import { GameEntity, StateMachine } from '../../../build/yuka.module.js';

// Define all states
import { 
  IdleState, 
  WalkState
  //ReachingState 
} from './States.js';

class AgentOne extends GameEntity {
  constructor() {
    super();

    // Core structural components
    this.joints = new Map();
    this.muscles = new Map();
    this.actionPatterns = new Map();
    
    // Energy system
    this.energy = {
      globalEnergy: 1.0,
      recoveryRate: 0.001,
      muscleEnergyCosts: new Map()
    };
    
    // Physics and visualization
    this.model = null;
    this.physicsWorld = null;
    this.scene = null;
    this.lastTime = performance.now();
    
    // Data management
    this.dataManager = {
      currentSnapshot: null,
      snapshotHistory: [],
      maxHistoryLength: 1000,
      db: null
    };
    
    // UI references
    this.ui = {
      currentState: document.getElementById('currentState')
    };
    
    // State machine setup
    this.stateMachine = new StateMachine(this);
    this.stateMachine.add('IDLE', new IdleState());
    this.stateMachine.add('WALK', new WalkState());
    //this.stateMachine.add('REACHING', new ReachingState());
    
    // Default to idle state
    this.stateMachine.changeTo('IDLE');
    
    // Timing controls
    this.currentTime = 0;
    this.stateDuration = 5;
    this.crossFadeDuration = 1;
    
    // Initialize systems
    this.initJoints();
    this.initMuscles();
    this.initActionPatterns();
    this.initDatabase();
  }
  
  // Initialize joint system
  initJoints() {
    // Create basic skeletal structure with joints
    const createJoint = (name, type, position, constraints) => {
      const joint = {
        type,
        position,
        constraints,
        connectedJoints: [],
        attachedMuscles: []
      };
      this.joints.set(name, joint);
      return joint;
    };
    
    // Create essential joints
    createJoint('root', 'limited', { x: 0, y: 0, z: 0 }, { min: -0.1, max: 0.1 });
    createJoint('spine', 'limited', { x: 0, y: 1.0, z: 0 }, { min: -0.3, max: 0.3 });
    createJoint('shoulder_left', 'ball', { x: -0.2, y: 1.4, z: 0 }, { min: -Math.PI/3, max: Math.PI/2 });
    createJoint('shoulder_right', 'ball', { x: 0.2, y: 1.4, z: 0 }, { min: -Math.PI/3, max: Math.PI/2 });
    createJoint('elbow_left', 'hinge', { x: -0.4, y: 1.2, z: 0 }, { min: -Math.PI/2, max: 0 });
    createJoint('elbow_right', 'hinge', { x: 0.4, y: 1.2, z: 0 }, { min: -Math.PI/2, max: 0 });
    createJoint('hip_left', 'ball', { x: -0.1, y: 0.9, z: 0 }, { min: -Math.PI/4, max: Math.PI/4 });
    createJoint('hip_right', 'ball', { x: 0.1, y: 0.9, z: 0 }, { min: -Math.PI/4, max: Math.PI/4 });
    createJoint('knee_left', 'hinge', { x: -0.15, y: 0.5, z: 0 }, { min: -Math.PI/2, max: 0 });
    createJoint('knee_right', 'hinge', { x: 0.15, y: 0.5, z: 0 }, { min: -Math.PI/2, max: 0 });
  }
  
  // Initialize muscle system
  initMuscles() {
    // Create muscle between two joints
    const createMuscle = (name, jointA, jointB, params) => {
      const jointAObj = this.joints.get(jointA);
      const jointBObj = this.joints.get(jointB);
      
      if (!jointAObj || !jointBObj) return;
      
      const muscle = {
        jointA: jointAObj,
        jointB: jointBObj,
        restLength: this.calculateDistance(jointAObj.position, jointBObj.position),
        maxContraction: params.maxContraction || 0.3,
        strength: params.strength || 1.0,
        contractionLevel: 0,
        energy: 0,
        feedback: 0,
        geometry: null,
        material: null,
        mesh: null
      };
      
      this.muscles.set(name, muscle);
      
      // Update joint references
      jointAObj.attachedMuscles.push(name);
      jointBObj.attachedMuscles.push(name);
      
      return muscle;
    };
    
    // Create essential muscles
    createMuscle('muscle_bicep_left', 'shoulder_left', 'elbow_left', { maxContraction: 0.4, strength: 1.2 });
    createMuscle('muscle_tricep_left', 'shoulder_left', 'elbow_left', { maxContraction: 0.4, strength: 1.0 });
    createMuscle('muscle_bicep_right', 'shoulder_right', 'elbow_right', { maxContraction: 0.4, strength: 1.2 });
    createMuscle('muscle_tricep_right', 'shoulder_right', 'elbow_right', { maxContraction: 0.4, strength: 1.0 });
    createMuscle('muscle_deltoid_left', 'spine', 'shoulder_left', { maxContraction: 0.3, strength: 1.1 });
    createMuscle('muscle_deltoid_right', 'spine', 'shoulder_right', { maxContraction: 0.3, strength: 1.1 });
    createMuscle('muscle_chest_left', 'spine', 'shoulder_left', { maxContraction: 0.2, strength: 1.0 });
    createMuscle('muscle_chest_right', 'spine', 'shoulder_right', { maxContraction: 0.2, strength: 1.0 });
    createMuscle('muscle_quad_left', 'hip_left', 'knee_left', { maxContraction: 0.3, strength: 1.5 });
    createMuscle('muscle_quad_right', 'hip_right', 'knee_right', { maxContraction: 0.3, strength: 1.5 });
    createMuscle('muscle_hamstring_left', 'hip_left', 'knee_left', { maxContraction: 0.3, strength: 1.3 });
    createMuscle('muscle_hamstring_right', 'hip_right', 'knee_right', { maxContraction: 0.3, strength: 1.3 });
  }
  
  // Initialize action patterns
  initActionPatterns() {
    // Create breathing FAP
    this.actionPatterns.set('breathing', {
      type: 'FAP',
      muscles: ['muscle_chest_left', 'muscle_chest_right'],
      frequency: 0.25,
      amplitude: 0.3,
      phase: 0,
      energyCost: 0.001,
      active: true
    });
    
    // Create walking HAP
    this.actionPatterns.set('walking', {
      type: 'HAP',
      muscles: ['muscle_quad_left', 'muscle_quad_right', 'muscle_hamstring_left', 'muscle_hamstring_right'],
      frequency: 0.8,
      amplitude: 0.7,
      phase: 0,
      energyCost: 0.005,
      active: false,
      haltConditions: ['detectObstacle'],
      resumeConditions: ['noObstacle']
    });
    
    // Create reaching TAP
    this.actionPatterns.set('reaching', {
      type: 'TAP',
      steps: [
        {
          muscles: ['muscle_deltoid_left'],
          contractions: [0.7],
          duration: 0.4
        },
        {
          muscles: ['muscle_bicep_left', 'muscle_tricep_left'],
          contractions: [0.6, 0.2],
          duration: 0.6
        },
        {
          muscles: ['muscle_bicep_left'],
          contractions: [0.8],
          duration: 0.3
        }
      ],
      currentStep: 0,
      stepTime: 0,
      completed: false,
      energyCost: 0.01,
      active: false
    });
  }
  
  // Initialize database for data management
  async initDatabase() {
    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
      });
      
      const db = new SQL.Database();
      
      db.exec(`
        CREATE TABLE IF NOT EXISTS snapshots (
          id INTEGER PRIMARY KEY,
          timestamp INTEGER,
          data TEXT
        );
        CREATE TABLE IF NOT EXISTS muscles (
          id TEXT PRIMARY KEY,
          jointA TEXT,
          jointB TEXT,
          params TEXT
        );
        CREATE TABLE IF NOT EXISTS action_patterns (
          id TEXT PRIMARY KEY,
          type TEXT,
          muscles TEXT,
          params TEXT
        );
      `);
      
      this.dataManager.db = {
        exec: (sql) => db.exec(sql),
        run: (sql, params) => {
          const stmt = db.prepare(sql);
          stmt.bind(params);
          stmt.step();
          stmt.free();
        },
        all: (sql, params) => {
          const stmt = db.prepare(sql);
          stmt.bind(params);
          
          const results = [];
          while(stmt.step()) {
            results.push(stmt.getAsObject());
          }
          stmt.free();
          
          return results;
        }
      };
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  }
  
  // Update method called every frame
  update(delta) {
    // Update current time
    this.currentTime += delta;
    
    // Update state machine
    this.stateMachine.update();
    
    // Update action patterns
    this.updateActionPatterns(delta);
    
    // Update physics
    this.updatePhysics(delta);
    
    // Update energy system
    this.updateEnergy(delta);
    
    // Capture data snapshot
    this.captureSnapshot();
    
    // Update visuals
    this.updateVisuals();
    
    return this;
  }
  
  // Update all active action patterns
  updateActionPatterns(delta) {
    // Loop through all action patterns and update based on type
    for (const [id, pattern] of this.actionPatterns.entries()) {
      if (!pattern.active) continue;
      
      if (pattern.type === 'FAP') {
        this.updateFAP(id, pattern, delta);
      } else if (pattern.type === 'HAP') {
        this.updateHAP(id, pattern, delta);
      } else if (pattern.type === 'TAP') {
        this.updateTAP(id, pattern, delta);
      }
    }
  }
  
  // Update Fixed Action Pattern
  updateFAP(id, pattern, delta) {
    const time = performance.now() / 1000;
    
    pattern.muscles.forEach((muscleName, index) => {
      const muscle = this.muscles.get(muscleName);
      if (!muscle) return;
      
      // Sinusoidal contraction pattern with phase offset per muscle
      const phase = pattern.phase + (index / pattern.muscles.length) * Math.PI;
      const contractionLevel = pattern.amplitude * 
        Math.sin(time * pattern.frequency * Math.PI * 2 + phase);
      
      this.contractMuscle(muscleName, Math.max(0, contractionLevel));
    });
    
    // Apply energy cost
    this.consumeEnergy(pattern.energyCost * delta);
  }
  
  // Update Haltable Action Pattern
  updateHAP(id, pattern, delta) {
    // Check halt conditions
    let shouldHalt = false;
    for (const condition of pattern.haltConditions) {
      if (condition === 'detectObstacle' && this.detectObstacle()) {
        shouldHalt = true;
        break;
      }
    }
    
    // Check resume conditions
    let shouldResume = false;
    if (!pattern.active) {
      for (const condition of pattern.resumeConditions) {
        if (condition === 'noObstacle' && !this.detectObstacle()) {
          shouldResume = true;
          break;
        }
      }
    }
    
    // Update active state
    if (pattern.active && shouldHalt) {
      pattern.active = false;
      // Relax muscles
      pattern.muscles.forEach(muscleName => {
        this.contractMuscle(muscleName, 0);
      });
    } else if (!pattern.active && shouldResume) {
      pattern.active = true;
    }
    
    // Only update if active
    if (pattern.active) {
      this.updateFAP(id, pattern, delta);
    }
  }
  
  // Update Transactional Action Pattern
  updateTAP(id, pattern, delta) {
    if (pattern.completed) return;
    
    const step = pattern.steps[pattern.currentStep];
    pattern.stepTime += delta;
    
    // Progress through step sequence
    if (pattern.stepTime >= step.duration) {
      pattern.currentStep++;
      pattern.stepTime = 0;
      
      if (pattern.currentStep >= pattern.steps.length) {
        pattern.completed = true;
        // Relax all muscles
        pattern.steps.forEach(step => {
          step.muscles.forEach(muscleName => {
            this.contractMuscle(muscleName, 0);
          });
        });
        return;
      }
    }
    
    // Apply muscle contractions for current step
    const progress = pattern.stepTime / step.duration;
    step.muscles.forEach((muscleName, i) => {
      const targetContraction = step.contractions[i];
      this.contractMuscle(muscleName, targetContraction * progress);
    });
    
    // Apply energy cost
    this.consumeEnergy(pattern.energyCost * delta);
  }
  
  // Contract a specific muscle
  contractMuscle(muscleName, level) {
    const muscle = this.muscles.get(muscleName);
    if (!muscle) return;
    
    muscle.contractionLevel = Math.max(0, Math.min(1, level));
    muscle.energy += muscle.contractionLevel * 0.01;
    
    // Calculate force based on contraction
    const targetLength = muscle.restLength * (1 - muscle.maxContraction * muscle.contractionLevel);
    const currentLength = this.calculateDistance(
      muscle.jointA.position, 
      muscle.jointB.position
    );
    const force = (currentLength - targetLength) * muscle.strength;
    
    // Update joint positions based on muscle contraction (simplified)
    // In a real implementation, this would involve complex physics
  }
  
  // Update physics simulation
  updatePhysics(delta) {
    if (this.physicsWorld) {
      this.physicsWorld.step(delta);
    }
  }
  
  // Update energy system
  updateEnergy(delta) {
    // Recover energy over time
    this.energy.globalEnergy = Math.min(
      1, 
      this.energy.globalEnergy + this.energy.recoveryRate * delta
    );
    
    // Track muscle energy costs
    for (const [muscleName, muscle] of this.muscles.entries()) {
      const currentCost = this.energy.muscleEnergyCosts.get(muscleName) || 0;
      this.energy.muscleEnergyCosts.set(muscleName, currentCost + muscle.energy * delta);
      
      // Reset per-frame energy accumulation
      muscle.energy = 0;
    }
    
    // Return energy state (though not used directly in this implementation)
    return {
      globalEnergy: this.energy.globalEnergy,
      exhaustedMuscles: Array.from(this.energy.muscleEnergyCosts.entries())
        .filter(([muscleName, cost]) => cost > 0.7)
        .map(([muscleName]) => muscleName)
    };
  }
  
  // Consume energy
  consumeEnergy(amount) {
    this.energy.globalEnergy = Math.max(0, this.energy.globalEnergy - amount);
    return this.energy.globalEnergy;
  }
  
  // Capture state snapshot
  captureSnapshot() {
    const timestamp = Date.now();
    const snapshot = {
      timestamp,
      muscles: Array.from(this.muscles.entries()).map(([id, muscle]) => ({
        id,
        contractionLevel: muscle.contractionLevel,
        energy: muscle.energy,
        feedback: muscle.feedback
      })),
      joints: Array.from(this.joints.entries()).map(([id, joint]) => ({
        id,
        position: joint.position
      })),
      actionPatterns: Array.from(this.actionPatterns.entries()).map(([id, pattern]) => ({
        id,
        type: pattern.type,
        active: pattern.active,
        energy: pattern.energyCost
      })),
      currentState: this.stateMachine.currentState
    };
    
    this.dataManager.currentSnapshot = snapshot;
    this.dataManager.snapshotHistory.push(snapshot);
    
    // Limit history length
    if (this.dataManager.snapshotHistory.length > this.dataManager.maxHistoryLength) {
      this.dataManager.snapshotHistory.shift();
    }
    
    // Save to database (async)
    if (this.dataManager.db) {
      this.dataManager.db.run(
        'INSERT INTO snapshots (timestamp, data) VALUES (?, ?)',
        [snapshot.timestamp, JSON.stringify(snapshot)]
      ).catch(error => console.error("Failed to save snapshot:", error));
    }
    
    return snapshot;
  }
  
  // Update visual representation
  updateVisuals() {
    if (!this.model) return;
    
    // Update muscle visualizations
    for (const [muscleName, muscle] of this.muscles.entries()) {
      if (muscle.mesh) {
        // Update mesh position, scale, and color based on contraction
        const intensity = muscle.contractionLevel * 0.5;
        muscle.material.color.setRGB(1, 0.5 - intensity, 0.5 - intensity);
        
        // Calculate direction vector between joints
        const direction = {
          x: muscle.jointB.position.x - muscle.jointA.position.x,
          y: muscle.jointB.position.y - muscle.jointA.position.y,
          z: muscle.jointB.position.z - muscle.jointA.position.z
        };
        
        // Calculate current length
        const currentLength = this.calculateDistance(muscle.jointA.position, muscle.jointB.position);
        
        // Update mesh position and scale
        muscle.mesh.position.set(
          (muscle.jointA.position.x + muscle.jointB.position.x) / 2,
          (muscle.jointA.position.y + muscle.jointB.position.y) / 2,
          (muscle.jointA.position.z + muscle.jointB.position.z) / 2
        );
        
        // Update mesh scale
        muscle.mesh.scale.set(1, currentLength / muscle.restLength, 1);
        
        // Update mesh rotation
        // In a real implementation, this would be more complex
      }
    }
  }
  
  // Helper function to detect obstacles
  detectObstacle() {
    if (!this.physicsWorld) return false;
    
    // Implement collision detection using physics system
    // Simplified version for illustration
    const position = this.joints.get('root').position;
    
    const rayFrom = { x: position.x, y: position.y + 1, z: position.z };
    const rayTo = { x: position.x, y: position.y + 1, z: position.z + 1 }; // 1m forward
    
    // This would be replaced with actual raycasting in the physics engine
    const hasHit = false; // Simulated result
    
    return hasHit;
  }
  
  // Helper function to calculate distance between points
  calculateDistance(pointA, pointB) {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    const dz = pointB.z - pointA.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  
  // Initialization function
  async initialize(scene) {
    this.scene = scene;
    
    // Setup physics
    this.setupPhysics();
    
    // Load model and setup visuals
    await this.loadModel();
    
    return this;
  }
  
  // Setup physics
  setupPhysics() {
    // In a real implementation, this would initialize a physics system like Cannon.js
    this.physicsWorld = {}; // Placeholder
  }
  
  // Load 3D model
  async loadModel() {
    // In a real implementation, this would load a 3D model
    // and setup visual representations for muscles, joints, etc.
    this.model = {}; // Placeholder
    
    // Setup muscle meshes
    for (const [muscleName, muscle] of this.muscles.entries()) {
      // Create visual representation for muscle
      // This would be replaced with actual Three.js code
    }
    
    return this.model;
  }
}

// State definitions would be in a separate file (States.js)
// Here's a simple example of what that might look like:
/*
import { State } from '../../../build/yuka.module.js';

class IdleState extends State {
  enter(agent) {
    // Activate breathing pattern
    const breathingPattern = agent.actionPatterns.get('breathing');
    breathingPattern.active = true;
    
    // Deactivate other patterns
    agent.actionPatterns.get('walking').active = false;
    agent.actionPatterns.get('reaching').active = false;
    
    // Update UI
    agent.ui.currentState.textContent = 'IDLE';
  }
  
  execute(agent) {
    // Check for transition conditions
    if (agent.energy.globalEnergy > 0.5 && Math.random() < 0.01) {
      agent.stateMachine.changeTo('WALKING');
    }
  }
  
  exit(agent) {
    // Nothing specific needed for exit
  }
}

class WalkingState extends State {
  enter(agent) {
    // Activate walking pattern
    const walkingPattern = agent.actionPatterns.get('walking');
    walkingPattern.active = true;
    
    // Keep breathing active
    agent.actionPatterns.get('breathing').active = true;
    
    // Update UI
    agent.ui.currentState.textContent = 'WALKING';
  }
  
  execute(agent) {
    // Check for transition conditions
    if (agent.energy.globalEnergy < 0.2) {
      agent.stateMachine.changeTo('IDLE');
    }
    
    // Check for obstacle handling via HAP
    // (HAP handles this internally via conditions)
  }
  
  exit(agent) {
    // Deactivate walking pattern
    agent.actionPatterns.get('walking').active = false;
  }
}

class ReachingState extends State {
  enter(agent) {
    // Reset and activate reaching pattern
    const reachingPattern = agent.actionPatterns.get('reaching');
    reachingPattern.currentStep = 0;
    reachingPattern.stepTime = 0;
    reachingPattern.completed = false;
    reachingPattern.active = true;
    
    // Keep breathing active
    agent.actionPatterns.get('breathing').active = true;
    
    // Update UI
    agent.ui.currentState.textContent = 'REACHING';
  }
  
  execute(agent) {
    // Check for completed transaction
    const reachingPattern = agent.actionPatterns.get('reaching');
    if (reachingPattern.completed) {
      agent.stateMachine.changeTo('IDLE');
    }
  }
  
  exit(agent) {
    // Nothing specific needed for exit since TAP auto-completes
  }
}

export { IdleState, WalkingState, ReachingState };
*/

// Main application initialization
function startApplication() {
  // Create and setup scene (simplified)
  const scene = {};
  
  // Create agent
  const agent = new AgentOne();
  agent.initialize(scene);
  
  // Setup controls
  document.addEventListener('keydown', (event) => {
    switch(event.key) {
      case 'w':
        agent.stateMachine.changeTo('WALK');
        break;
      case 's':
        agent.stateMachine.changeTo('IDLE');
        break;
        /*
      case 'r':
        agent.stateMachine.changeTo('REACHING');
        break;
        */
    }
  });
  
  // Start animation loop
  let lastTime = performance.now();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const now = performance.now();
    const delta = (now - lastTime) / 1000; // in seconds
    lastTime = now;
    
    // Update agent
    agent.update(delta);
    
    // Render scene (simplified)
    // renderer.render(scene, camera);
  }
  
  animate();
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', startApplication);

export { AgentOne };