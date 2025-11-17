// GENERATED FOR TESTING PURPOSE

import { useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";

function BabylonTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine and scene
    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);

    // Create camera (can rotate with mouse)
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      0,
      10,
      BABYLON.Vector3.Zero(),
      scene,
    );
    camera.attachControl(canvasRef.current, true);

    // Create light
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Create sphere
    const sphere = BABYLON.MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2 },
      scene,
    );

    // Render loop with animation
    engine.runRenderLoop(() => {
      sphere.rotation.y += 0.01;
      scene.render();
    });

    // Handle resize
    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-900">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default BabylonTest;
