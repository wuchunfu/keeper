package utility

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"testing"
)

func Test_EncryptPasswordField(t *testing.T) {
	connection := map[string]string{
		"server":     "localhost",
		"engine":     "mysql@dbgate-pluginMysql",
		"sshMode":    "userPassword",
		"sshPort":    "22",
		"sshKeyfile": "/Users/liuliutiyong/.ssh/id_rsa",
		"user":       "root",
		"password":   "123456",
	}

	pwd := encryptPasswordField(connection, "password")["password"]
	fmt.Println(pwd)
	connection["password"] = pwd
	_ = decryptPasswordField(connection, "password")["password"]

}

func Test_LoadEncryptionKey(t *testing.T) {
	key2 := LoadEncryptionKey()
	fmt.Println(key2)
}

func Test_DataDir(t *testing.T) {
	NewJsonLinesDatabase(filepath.Join(DataDir(), "connections.jsonl"))
}

func Test_MaskConnection(t *testing.T) {
	fmt.Println(MaskConnection(map[string]string{
		"server":     "localhost",
		"engine":     "mysql@dbgate-pluginMysql",
		"sshMode":    "userPassword",
		"sshPort":    "22",
		"sshKeyfile": "/Users/liuliutiyong/.ssh/id_rsa",
		"user":       "root",
		"password":   "123456",
	}))
}

func Test_PickSafeConnectionInfo(t *testing.T) {

	fmt.Println(DataDir())

	fmt.Println(PickSafeConnectionInfo(map[string]string{
		"server":     "localhost",
		"engine":     "mysql@dbgate-pluginMysql",
		"sshMode":    "userPassword",
		"sshPort":    "22",
		"sshKeyfile": "/Users/liuliutiyong/.ssh/id_rsa",
		"user":       "root",
		"password":   "123456",
	}))
}

func Test_Read2(t *testing.T) {
	// 第二种
	fd, err := os.Open("/Users/liuliutiyong/keeper-data/connections.jsonl")
	defer fd.Close()
	if err != nil {
		fmt.Println("read error:", err)
	}
	buff := bufio.NewReader(fd)

	for {
		data, _, eof := buff.ReadLine()
		if eof == io.EOF {
			break
		}

		fmt.Println(string(data))
	}
}