using System;
using System.IO;
using System.Collections;
using System.Net;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

[Serializable]
public class CubeInfo {
    public int red = 255;
    public int green = 255;
    public int blue = 255;
    public float rotation_x = 0.0f;
    public float rotation_y = 0.0f;
    public float rotation_z = 0.0f;
}

public class CubeSpinner : MonoBehaviour
{
    CubeInfo cube_info = new CubeInfo();
    const float CHECK_TIME = 2.0f;
    float count_down = CHECK_TIME;

    // Start is called before the first frame update
    void Start()
    {
        StartCoroutine(GetCubeInfo(UpdateCubeStatus));
    }

    // Update is called once per frame
    void Update()
    {
        this.count_down -= Time.deltaTime;
        if (this.count_down <= 0.0f) {
            StartCoroutine(GetCubeInfo(UpdateCubeStatus));
            this.count_down = CHECK_TIME;
        }
        this.transform.rotation *= Quaternion.Euler(cube_info.rotation_x * Time.deltaTime, 
                                                    cube_info.rotation_y * Time.deltaTime,
                                                    cube_info.rotation_z * Time.deltaTime);

        Color cube_color = new Color(cube_info.red/255.0f, cube_info.green/255.0f, cube_info.blue/255.0f);
        this.GetComponent<Renderer>().material.SetColor("_Color", cube_color);
    }

    IEnumerator GetCubeInfo(Action<CubeInfo> onSuccess)
    {
        using (UnityWebRequest req = UnityWebRequest.Get(String.Format("localhost:5000/api/v1/cube")))
        {
            yield return req.Send();
            while (!req.isDone)
                yield return null;
            byte[] result = req.downloadHandler.data;
            string cubeJSON = System.Text.Encoding.Default.GetString(result);
            Debug.Log(cubeJSON);
            CubeInfo info = JsonUtility.FromJson<CubeInfo>(cubeJSON);
            onSuccess(info);
        }
    }
 	
    public void UpdateCubeStatus(CubeInfo cube)
    {
        this.cube_info = cube;
    }  
}
