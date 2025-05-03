# Configuração do HServ (Máquinas e redes virtuais)

Instale no HServ (host físico Linux):
```
sudo apt update && sudo apt install qemu-kvm libvirt-daemon-system virt-manager virtinst bridge-utils
```
Verifique se a máquina suporta virtualização:
```
egrep -c '(vmx|svm)' /proc/cpuinfo
```
(se o resultado for >0, está ok)

Adicione seu usuário ao grupo libvirt:
```
sudo usermod -aG libvirt $USER
```
(Reinicie a sessão para aplicar)

Após reiniciar sessão aplicar:
```
newgrp libvirt
```

Teste o virt-manager:
```
virt-manager
```
Ele deve abrir a interface gráfica.

Teste o virsh:
```
virsh list --all
```

para instalar a imagem base do SO que será utilizado nas VM's, execute o comando:
```
wget https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-standard-3.19.1-x86_64.iso
```
Ps: atenção com o local no qual irá manter o arquivo da imagem, pois o script de criação espera encontrar na path $HOME configurado.

### executar o script para inicializar a criação das redes e máquinas virtuais
```
chmod +x create-vm.sh
./create-vm.sh
```